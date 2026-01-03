"use client";

import ContentInput from "./ContentInput";
import Drafts from "./drafts/Drafts";
import SaveDraft from "./drafts/SaveDraft";
import { createPost } from "@/actions/createPost";
import useCreatePostStatusState from "@/stores/createPostStatus";
import useDraftStore from "@/stores/drafts";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

export default function CreatePost() {
	const [state, formAction, pending] = useActionState(createPost, null);
	const parentId = useCreatePostStatusState(state => state.postId);
	const globalContent = useCreatePostStatusState(state => state.content);
	const [localContent, setLocalContent] = useState("");
	const [showSaveDraft, setShowSaveDraft] = useState(false);
	const [showDrafts, setShowDrafts] = useState(false);
	const drafts = useDraftStore(state => state.drafts);

	const pathname = usePathname();
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			setLocalContent("");

			formRef.current?.reset();
			router.back();
		}
	}, [state]);

	useEffect(() => {
		setLocalContent(globalContent);
	}, [globalContent]);

	function backButton() {
		if (localContent) {
			setShowSaveDraft(true);
			return;
		}

		router.back();
	}

	return (
		<>
			<div className="bg-white p-8">
				<div className="flex justify-between">
					<button onClick={backButton}>닫기</button>
					<div className="flex gap-2">
						{drafts.length > 0 ? (
							<button onClick={() => setShowDrafts(true)}>
								임시 저장 목록
							</button>
						) : null}
						<input
							type="submit"
							value="작성"
							disabled={pending}
							form="create-post"
						/>
					</div>
				</div>
				<Form ref={formRef} action={formAction} id="create-post">
					{parentId ? (
						<input type="hidden" name="parentId" value={parentId} />
					) : null}
					<input type="hidden" name="currentPath" value={pathname} />
					<ContentInput
						content={localContent}
						setContent={setLocalContent}
					/>
					{state && !state?.success ? (
						<p className="text-red-500">{state?.error}</p>
					) : null}
				</Form>
			</div>
			{showSaveDraft ? (
				<SaveDraft content={localContent} parentId={parentId} />
			) : null}
			{showDrafts ? <Drafts setShowDrafts={setShowDrafts} /> : null}
		</>
	);
}
