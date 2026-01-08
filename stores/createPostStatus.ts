import { type Image } from "./drafts";
import { create } from "zustand";

export interface CreatePostStatus {
	content: string;
	postId: number | null;
	images: Image[];
	setContent: (content: string) => void;
	setPostId: (postId: number | null) => void;
	setImages: (images: Image[]) => void;
}

const useCreatePostStatusState = create<CreatePostStatus>(set => ({
	content: "",
	postId: null,
	images: [],
	setContent: content => set(() => ({ content })),
	setPostId: postId => set(() => ({ postId })),
	setImages: images => set(() => ({ images })),
}));

export default useCreatePostStatusState;
