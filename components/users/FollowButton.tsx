"use client";

import FollowForm from "./FollowForm";
import { type FollowStatus } from "@/lib/services/user";
import { useState } from "react";

export default function FollowButton({
	userId,
	protected: isProtected,
	initialFollowStatus,
}: {
	userId: number;
	protected: boolean;
	initialFollowStatus: FollowStatus;
}) {
	const [followStatus, setFollowStatus] = useState(initialFollowStatus);

	function handleFollow() {
		switch (followStatus) {
			case "FOLLOWING":
			case "REQUESTED":
				setFollowStatus("NOT_FOLLOWING");
				break;
			case "NOT_FOLLOWING":
				if (isProtected) setFollowStatus("REQUESTED");
				else setFollowStatus("FOLLOWING");
				break;
		}
	}

	return (
		<FollowForm userId={userId} protected={isProtected}>
			<button type="submit" onClick={handleFollow}>
				{followStatus === "NOT_FOLLOWING" ? "팔로우" : null}
				{followStatus === "REQUESTED" ? "팔로우 요청됨" : null}
				{followStatus === "FOLLOWING" ? "팔로우 취소" : null}
			</button>
		</FollowForm>
	);
}
