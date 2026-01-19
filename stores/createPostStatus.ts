import { Image } from "./drafts";
import { create } from "zustand";

export interface CreatePostStatus {
	// States
	content: string;
	/** @description 답글을 위한 값 */
	parentId: number | null;
	/** @description 게시글 수정을 위한 값 */
	postId: number | null;
	images: ImageWithPreview[];

	// Actions
	setContent: (content: string) => void;
	setParentId: (parentId: number | null) => void;
	setPostId: (postId: number | null) => void;
	setImages: (images: ImageWithPreview[]) => void;
	discardChanges: () => void;
}

export class ImageWithPreview extends Image {
	#preview: string;

	public constructor(image: Image) {
		super(image.order, image.file);

		this.#preview = URL.createObjectURL(this.file);
	}

	get preview() {
		return this.#preview;
	}

	public revokePreview() {
		URL.revokeObjectURL(this.#preview);
	}

	public getImage() {
		return new Image(this.order, this.file);
	}
}

const initial = {
	content: "",
	parentId: null,
	postId: null,
	images: [],
};

const useCreatePostStatusState = create<CreatePostStatus>(set => ({
	...initial,
	setContent: content => set(() => ({ content })),
	setParentId: parentId => set(() => ({ parentId })),
	setPostId: postId => set(() => ({ postId })),
	setImages: images => set(() => ({ images })),
	discardChanges: () => set(() => ({ ...initial })),
}));

export default useCreatePostStatusState;
