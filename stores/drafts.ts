import { del as removeItem, set as setItem } from "idb-keyval";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export class Image {
	order: number;
	file: File;

	public constructor(order: number, file: File) {
		this.order = order;
		this.file = file;
	}
}

export interface InsertDraft {
	content: string;
	parentId: number | null;
	images: Image[];
}

export interface Draft extends Omit<InsertDraft, "images"> {
	images: number;
	draftId: number;
}
export interface DraftStore {
	drafts: Draft[];
	addDraft: (draft: InsertDraft) => Promise<void>;
	removeDraft: (draftId: number) => Promise<void>;
	removeAllDraft: () => void;
}

const useDraftStore = create<DraftStore>()(
	persist(
		set => ({
			drafts: [],
			addDraft: async draft => {
				const draftId = Math.floor(Math.random() * 1000);
				await setItem(draftId, draft.images);

				set(state => {
					// TODO: change draft id algorithm
					const newDraft: Draft = {
						content: draft.content,
						parentId: draft.parentId,
						images: draftId,
						draftId,
					};

					return { drafts: [newDraft, ...state.drafts] };
				});
			},
			removeDraft: async draftId => {
				await removeItem(draftId);

				set(state => {
					let list = [...state.drafts];

					list = list.filter(draft => draft.draftId !== draftId);

					return { drafts: [...list] };
				});
			},
			removeAllDraft: () => {
				set(state => {
					(async () => {
						for (const draft of state.drafts) {
							await removeItem(draft.images);
						}
					})();

					return { drafts: [] };
				});
			},
		}),
		{
			name: "drafts-store",
		},
	),
);

export default useDraftStore;
