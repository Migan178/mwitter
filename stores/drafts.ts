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

					return { drafts: [newDraft, ...state.drafts] };
				}),
			removeDraft: draftId =>
				set(state => {
					void removeItem(draftId);

					let list = [...state.drafts];

					list = list.filter(draft => draft.draftId !== draftId);

					return { drafts: [...list] };
				}),
			removeAllDraft: () => set(() => ({ drafts: [] })),
		}),
		{
			name: "drafts-store",
		},
	),
);

export default useDraftStore;
