import { create } from "zustand";

export interface CreatePostStatus {
	content: string;
	postId: number | null;
	setContent: (content: string) => void;
	setPostId: (postId: number | null) => void;
}

const useCreatePostStatusState = create<CreatePostStatus>(set => ({
	content: "",
	postId: null,
	setContent: content => set(() => ({ content })),
	setPostId: postId => set(() => ({ postId })),
}));

export default useCreatePostStatusState;
