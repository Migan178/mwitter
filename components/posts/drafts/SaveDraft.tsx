"use client";

import Modal from "../../Modal";
import useCreatePostStatusState from "@/stores/createPostStatus";
import useDraftStore from "@/stores/drafts";
import { useRouter } from "next/navigation";

export default function SaveDraft() {
	const router = useRouter();

	const addDraft = useDraftStore(state => state.addDraft);
	const content = useCreatePostStatusState(state => state.content);
	const parentId = useCreatePostStatusState(state => state.parentId);
	const images = useCreatePostStatusState(state => state.images);
	const postId = useCreatePostStatusState(state => state.postId);
	const discardChanges = useCreatePostStatusState(
		state => state.discardChanges,
	);

	function handleSaveDraft() {
		addDraft({
			content,
			parentId,
			postId,
			images: images.map(image => image.getImage()),
		});

		handleDiscardChanges();
	}

	function handleDiscardChanges() {
		images.forEach(image => image.revokePreview());
		discardChanges();

		router.back();
	}

	return (
		<Modal>
			<div className="bg-white p-8">
				<p>해당 게시글을 임시 저장 하시겠어요, 아니면 버리시겠어요?</p>
				<div className="flex gap-x-2 mt-2">
					<button
						onClick={handleSaveDraft}
						className="primary-button"
					>
						저장
					</button>
					<button onClick={handleDiscardChanges}>버리기</button>
				</div>
			</div>
		</Modal>
	);
}
