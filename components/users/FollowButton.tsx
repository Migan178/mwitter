"use client";

import { toggleFollow } from "@/actions/toggleFollow";
import Form from "next/form";
import { useState } from "react";

export default function FollowButton({
	userId,
	initialIsFollowing,
}: {
	userId: number;
	initialIsFollowing: boolean;
}) {
	const [isFollowing, setFollowing] = useState(initialIsFollowing);

	return (
		<Form action={toggleFollow}>
			<input type="hidden" value={userId} name="userId" />
			<button
				type="submit"
				className="hover:cursor-pointer"
				onClick={() => setFollowing(!isFollowing)}
			>
				{isFollowing ? "팔로우 취소" : "팔로우"}
			</button>
		</Form>
	);
}
