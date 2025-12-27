"use client";

import Modal from "@/components/Modal";
import useCreatePostStatusState from "@/stores/createPostStatus";
import useDraftStore from "@/stores/drafts";

export default function Drafts({
	setShowDrafts,
}: {
	setShowDrafts: (showDrafts: boolean) => void;
}) {
	const drafts = useDraftStore(state => state.drafts);
	const removeDraft = useDraftStore(state => state.removeDraft);
	const setParentId = useCreatePostStatusState(state => state.setPostId);
	const setContent = useCreatePostStatusState(state => state.setContent);

	function applyDraft(id: number) {
		const { content, parentId } = drafts.find(
			draft => draft.draftId === id,
		)!;

		setParentId(parentId);
		setContent(content);

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
