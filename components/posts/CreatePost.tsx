"use client";

import ContentInput from "./ContentInput";
import Drafts from "./drafts/Drafts";
import SaveDraft from "./drafts/SaveDraft";
import ImagePreviewList from "./images/ImagePreviewList";
import { createPost } from "@/actions/createPost";
import useCreatePostStatusState, {
	ImageWithPreview,
} from "@/stores/createPostStatus";
import useDraftStore, { Image } from "@/stores/drafts";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import {
	ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";

export default function CreatePost() {
	const pathname = usePathname();
	const imageInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const parentId = useCreatePostStatusState(state => state.parentId);
	const content = useCreatePostStatusState(state => state.content);
	const images = useCreatePostStatusState(state => state.images);
	const setImages = useCreatePostStatusState(state => state.setImages);
	const drafts = useDraftStore(state => state.drafts);
	const discardChanges = useCreatePostStatusState(
		state => state.discardChanges,
	);

	const [state, formAction, pending] = useActionState(createPost, null);
	const [showSaveDraft, setShowSaveDraft] = useState(false);
	const [showDrafts, setShowDrafts] = useState(false);

	useEffect(() => {
		if (state?.success) {
			router.back();

			images.forEach(image => image.revokePreview());
			discardChanges();
		}
	}, [router, state?.success, discardChanges]);

	function backButton() {
		if (content || images.length) {
			setShowSaveDraft(true);
			return;
		}

		images.forEach(image => image.revokePreview());
		discardChanges();

		router.back();
	}

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || !e.target.files.length) return;
		const newImages = [...e.target.files].map(
			(file, i) => new ImageWithPreview(new Image(i, file)),
		);

		setImages([...images, ...newImages]);

		e.target.value = "";
	}

	function handleAddImage() {
		imageInputRef.current?.click();
	}

	async function handleSubmit(formData: FormData) {
		for (const image of images.toSorted((a, b) => a.order - b.order)) {
			formData.append("images", image.file);
		}

		formAction(formData);
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
				<Form action={handleSubmit} id="create-post">
					{parentId ? (
						<input type="hidden" name="parentId" value={parentId} />
					) : null}
					<input type="hidden" name="currentPath" value={pathname} />
					<input
						type="file"
						className="hidden"
						ref={imageInputRef}
						onChange={handleFileChange}
						accept="image/*"
						multiple
					/>
					<ContentInput />
					{state && !state?.success ? (
						<p className="text-red-500">{state?.error}</p>
					) : null}
				</Form>
				<button onClick={handleAddImage}>사진 추가</button>
				<ImagePreviewList />
			</div>
			{showSaveDraft ? <SaveDraft /> : null}
			{showDrafts ? <Drafts setShowDrafts={setShowDrafts} /> : null}
		</>
	);
}
