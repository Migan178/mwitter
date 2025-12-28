export interface PostDataProps {
	authorId: number;
	user: string;
	handle: string;
	content: string;
	createdAt: Date;
	id: number;
	likes: number;
	liked: boolean;
	/**
	 * @description A user's handle who created parent post
	 */
	reply?: string;
}
