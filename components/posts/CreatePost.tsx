"use client";

import ContentInput from "./ContentInput";
import Drafts from "./drafts/Drafts";
import SaveDraft from "./drafts/SaveDraft";
import ImagePreviewList from "./images/ImagePreviewList";
import { createPost } from "@/actions/createPost";
import useCreatePostStatusState from "@/stores/createPostStatus";
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
	const [state, formAction, pending] = useActionState(createPost, null);
	const parentId = useCreatePostStatusState(state => state.postId);
	const globalContent = useCreatePostStatusState(state => state.content);
	const globalImages = useCreatePostStatusState(state => state.images);
	const [localContent, setLocalContent] = useState("");
	const [showSaveDraft, setShowSaveDraft] = useState(false);
	const [showDrafts, setShowDrafts] = useState(false);
	const [localImages, setLocalImages] = useState<Image[]>([]);
	const drafts = useDraftStore(state => state.drafts);

	const pathname = usePathname();
	const formRef = useRef<HTMLFormElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			setLocalContent("");

			formRef.current?.reset();
			router.back();
		}
	}, [state]);

	useEffect(() => setLocalContent(globalContent), [globalContent]);
	useEffect(() => setLocalImages(globalImages), [globalImages]);

	function backButton() {
		if (localContent || localImages.length) {
			setShowSaveDraft(true);
			return;
		}

		router.back();
	}

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || !e.target.files.length) return;
		const newImages = Array.from(e.target.files).map(
			(file, i) => new Image(i, file),
		);

		setLocalImages([...localImages, ...newImages]);

		e.target.value = "";
	}

	function handleAddImage() {
		imageInputRef.current?.click();
	}

	async function handleSubmit(formData: FormData) {
		const images = localImages.toSorted((a, b) => a.order - b.order);
		for (const image of images) {
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
				<Form ref={formRef} action={handleSubmit} id="create-post">
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
					<ContentInput
						content={localContent}
						setContent={setLocalContent}
					/>
					{state && !state?.success ? (
						<p className="text-red-500">{state?.error}</p>
					) : null}
				</Form>
				<button onClick={handleAddImage}>사진 추가</button>
				{localImages.length ? (
					<ImagePreviewList
						images={localImages}
						setImages={setLocalImages}
					/>
				) : null}
			</div>
			{showSaveDraft ? (
				<SaveDraft
					content={localContent}
					parentId={parentId}
					images={localImages}
				/>
			) : null}
			{showDrafts ? <Drafts setShowDrafts={setShowDrafts} /> : null}
		</>
	);
}
