"use client";

import Draft from "./Draft";
import Modal from "@/components/Modal";
import Separator from "@/components/Separator";
import useCreatePostStatusState, {
	ImageWithPreview,
} from "@/stores/createPostStatus";
import useDraftStore, {
	type Draft as DraftType,
	type Image,
} from "@/stores/drafts";
import { get as getItem } from "idb-keyval";
import { useEffect, useState } from "react";

export interface DraftAndPreview extends DraftType {
	preview?: string;
}

export default function Drafts({
	setShowDrafts,
}: {
	setShowDrafts: (showDrafts: boolean) => void;
}) {
	const drafts = useDraftStore(state => state.drafts);
	const removeDraft = useDraftStore(state => state.removeDraft);
	const setParentId = useCreatePostStatusState(state => state.setParentId);
	const setContent = useCreatePostStatusState(state => state.setContent);
	const setGlobalImages = useCreatePostStatusState(state => state.setImages);
	const removeAllDraft = useDraftStore(state => state.removeAllDraft);

	const [localImages, setLocalImages] = useState<
		Record<number, ImageWithPreview[]>
	>({});

	useEffect(() => {
		(async () => {
			for (const draft of drafts) {
				const images = (await getItem<Image[]>(draft.images))!;

				if (images.length)
					setLocalImages(prev => ({
						...prev,
						[draft.draftId]: images.map(
							image => new ImageWithPreview(image),
						),
					}));
			}
		})();
	}, []);

	function applyDraft(draft: DraftType) {
		setParentId(draft.parentId);
		setContent(draft.content);

		if (localImages[draft.draftId]) {
			setGlobalImages(
				localImages[draft.draftId].toSorted(
					(a, b) => a.order - b.order,
				),
			);
		}

		removeDraft(draft.draftId);
		setShowDrafts(false);
	}

	function handleRemoveAll() {
		removeAllDraft();
		setShowDrafts(false);
	}

	return (
		<Modal>
			<div className="bg-white p-8 w-100 h-80">
				<div className="flex justify-between">
					<button onClick={() => setShowDrafts(false)}>닫기</button>
					<button onClick={handleRemoveAll}>모두 삭제</button>
				</div>
				<ul>
					{drafts.map((draft, i) => (
						<li key={draft.draftId} className="w-full">
							<Draft
								preview={
									localImages[draft.draftId]?.[0]?.preview
								}
								draft={draft}
								applyDraft={applyDraft}
							/>
							{i < drafts.length - 1 ? <Separator /> : null}
						</li>
					))}
				</ul>
			</div>
		</Modal>
	);
}
