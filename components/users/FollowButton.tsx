"use client";

import FollowForm from "./FollowForm";
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
		<FollowForm userId={userId}>
			<button type="submit" onClick={() => setFollowing(!isFollowing)}>
				{isFollowing ? "팔로우 취소" : "팔로우"}
			</button>
		</FollowForm>
	);
}
