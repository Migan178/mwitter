import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InsertDraft {
	content: string;
	parentId: number | null;
}

export interface Draft extends InsertDraft {
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
					// TODO: change draft id algorithm
					const newDraft: Draft = {
						...draft,
						draftId: Math.floor(Math.random() * 1000),
					};

					state.drafts.push(newDraft);

					return state;
				}),
			removeDraft: draftId =>
				set(state => {
					const id = state.drafts.findIndex(
						draft => draft.draftId === draftId,
					);

					state.drafts.splice(id, 1);

					return state;
				}),
			removeAllDraft: () => set(() => ({ drafts: [] })),
		}),
		{ name: "drafts-store" },
	),
);

export default useDraftStore;
