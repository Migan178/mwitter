import { del as removeItem, set as setItem } from "idb-keyval";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export class Image {
	public order: number;
	public file: File;
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
	addDraft: (draft: InsertDraft) => void;
	removeDraft: (draftId: number) => void;
	removeAllDraft: () => void;
}

const useDraftStore = create<DraftStore>()(
	persist(
		set => ({
			drafts: [],
			addDraft: draft =>
				set(state => {
					const draftId = Math.floor(Math.random() * 1000);

					// TODO: change draft id algorithm
					const newDraft: Draft = {
						content: draft.content,
						parentId: draft.parentId,
						images: draftId,
						draftId,
					};

					void setItem(draftId, draft.images);

					state.drafts.push(newDraft);

					return state;
				}),
			removeDraft: draftId =>
				set(state => {
					const id = state.drafts.findIndex(
						draft => draft.draftId === draftId,
					);

					void removeItem(draftId);

					state.drafts.splice(id, 1);

					return state;
				}),
			removeAllDraft: () => set(() => ({ drafts: [] })),
		}),
		{
			name: "drafts-store",
		},
	),
);

export default useDraftStore;
