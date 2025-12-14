"use client";

import { createPost } from "@/actions/createPost";
import Form from "next/form";
import { useActionState, useEffect, useRef, useState } from "react";
import ContentInput from "./ContentInput";
import { useRouter } from "next/navigation";

export default function CreatePost() {
	const [state, formAction, pending] = useActionState(createPost, null);
	const [content, setContent] = useState("");
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			setContent("");

			formRef.current?.reset();
			router.refresh();
		}
	}, [state]);

	return (
		<Form ref={formRef} action={formAction}>
			<ContentInput content={content} setContent={setContent} />
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
