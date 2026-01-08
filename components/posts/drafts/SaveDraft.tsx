"use client";

import Modal from "../../Modal";
import useCreatePostStatusState from "@/stores/createPostStatus";
import useDraftStore, { type Image } from "@/stores/drafts";
import { useRouter } from "next/navigation";

export default function SaveDraft({
	content,
	parentId,
	images,
}: {
	content: string;
	images: Image[];
	parentId: number | null;
}) {
	const router = useRouter();
	const addDraft = useDraftStore(state => state.addDraft);
	const setContent = useCreatePostStatusState(state => state.setContent);
	const setPostId = useCreatePostStatusState(state => state.setPostId);

	const setImages = useCreatePostStatusState(state => state.setImages);
	function saveDraft() {
		addDraft({
			content,
			parentId,
			images,
		});

		router.back();
	}

	function discardChanges() {
		setContent("");
		setPostId(null);
		setImages([]);

		router.back();
	}

	return (
		<Modal>
			<div className="bg-white p-8">
				<p>해당 게시글을 임시 저장 하시겠어요, 아니면 버리시겠어요?</p>
				<div className="flex gap-x-2">
					<div>
						<button onClick={saveDraft}>저장</button>
					</div>
					<div>
						<button onClick={discardChanges}>버리기</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
