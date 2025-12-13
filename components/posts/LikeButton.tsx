"use client";

import { toggleLike } from "@/actions/toggleLike";
import Form from "next/form";
import { useState } from "react";

export function LikeButton({
	postId,
	initialLikes,
	initialLiked,
}: {
	postId: number;
	initialLikes: number;
	initialLiked: boolean;
}) {
	const [likes, setLikes] = useState(initialLikes);
	const [isLiked, setLiked] = useState(initialLiked);

	function toggleLikeButton() {
		if (isLiked) {
			setLiked(false);
			setLikes(likes - 1);
			return;
		}

		setLiked(true);
		setLikes(likes + 1);
	}

	return (
		<Form action={toggleLike}>
			<input type="hidden" value={postId} name="postId" />
			<button
				type="submit"
				className="hover:cursor-pointer"
				onClick={toggleLikeButton}
			>
				{likes} {isLiked ? "좋아요 취소" : "좋아요"}
			</button>
		</Form>
	);
}
