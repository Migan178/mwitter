"use client";

import ContentInput from "./ContentInput";
import { createPost } from "@/actions/createPost";
import useCreatePostStatusState from "@/stores/createPostStatus";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

export default function CreatePost({ className }: { className?: string }) {
	const [state, formAction, pending] = useActionState(createPost, null);
	const parentId = useCreatePostStatusState(state => state.postId);
	const globalContent = useCreatePostStatusState(state => state.content);
	const setGlobalContent = useCreatePostStatusState(
		state => state.setContent,
	);
	const [localContent, setLocalContent] = useState(globalContent);

	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			setGlobalContent("");

			formRef.current?.reset();
			router.back();
		}
	}, [state]);

	function setContent(content: string) {
		setLocalContent(content);
		setGlobalContent(content);
	}

	return (
		<Form ref={formRef} action={formAction} className={className}>
			{parentId ? (
				<input type="hidden" name="parentId" value={parentId} />
			) : null}
			<ContentInput content={localContent} setContent={setContent} />
			<div>
				<input
					type="submit"
					value="작성"
					className="hover:cursor-pointer"
					disabled={pending}
				/>
			</div>
			{state && !state?.success ? (
				<p className="text-red-500">{state?.error}</p>
			) : null}
		</Form>
	);
}
