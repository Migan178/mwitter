"use client";

import ContentInput from "./ContentInput";
import Drafts from "./drafts/Drafts";
import SaveDraft from "./drafts/SaveDraft";
import ImagePreviewList from "./images/ImagePreviewList";
import { createPost } from "@/actions/createPost";
import useCreatePostStatusState, {
	ImageWithPreview,
} from "@/stores/createPostStatus";
import useDraftStore, { Image as ImageClass } from "@/stores/drafts";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import {
	ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";
import { Image, XLg } from "react-bootstrap-icons";

export default function CreatePost() {
	const pathname = usePathname();
	const imageInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	const parentId = useCreatePostStatusState(state => state.parentId);
	const postId = useCreatePostStatusState(state => state.postId);
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
			(file, i) => new ImageWithPreview(new ImageClass(i, file)),
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
			<div className="bg-white p-8 w-120">
				<div className="flex justify-between">
					<button onClick={backButton}>
						<XLg />
					</button>
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
							className="primary-button"
							form="create-post"
						/>
					</div>
				</div>
				<Form action={handleSubmit} id="create-post">
					{parentId ? (
						<input type="hidden" name="parentId" value={parentId} />
					) : null}
					{postId ? (
						<input type="hidden" name="postId" value={postId} />
					) : null}
					<input type="hidden" name="currentPath" value={pathname} />
					{!postId ? (
						<input
							type="file"
							className="hidden"
							ref={imageInputRef}
							onChange={handleFileChange}
							accept="image/*"
							multiple
						/>
					) : null}
					<ContentInput />
					{state && !state?.success ? (
						<p className="text-red-500">{state?.error}</p>
					) : null}
				</Form>
				{!postId ? (
					<button onClick={handleAddImage}>
						<Image size={20} className="text-blue-500" />
					</button>
				) : null}
				<ImagePreviewList />
			</div>
			{showSaveDraft ? <SaveDraft /> : null}
			{showDrafts ? <Drafts setShowDrafts={setShowDrafts} /> : null}
		</>
	);
}
