"use client";

import Modal from "@/components/Modal";
import useCreatePostStatusState from "@/stores/createPostStatus";
import useDraftStore, { Image } from "@/stores/drafts";
import { get as getItem } from "idb-keyval";

export default function Drafts({
	setShowDrafts,
}: {
	setShowDrafts: (showDrafts: boolean) => void;
}) {
	const drafts = useDraftStore(state => state.drafts);
	const removeDraft = useDraftStore(state => state.removeDraft);
	const setParentId = useCreatePostStatusState(state => state.setPostId);
	const setContent = useCreatePostStatusState(state => state.setContent);
	const setImages = useCreatePostStatusState(state => state.setImages);

	async function applyDraft(id: number) {
		const { content, parentId, images } = drafts.find(
			draft => draft.draftId === id,
		)!;

		const imageFiles = (await getItem<Image[]>(images))!;

		setParentId(parentId);
		setContent(content);
		setImages(imageFiles.toSorted((a, b) => a.order - b.order));

		removeDraft(id);
		setShowDrafts(false);
	}

	return (
		<Modal>
			<div className="bg-white p-8">
				<div>
					<button onClick={() => setShowDrafts(false)}>닫기</button>
				</div>
				<ul>
					{drafts.map(draft => (
						<li key={draft.draftId}>
							<button onClick={() => applyDraft(draft.draftId)}>
								{draft.content}
							</button>
						</li>
					))}
				</ul>
			</div>
		</Modal>
	);
}
