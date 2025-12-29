"use client";

import Description from "./Description";
import FollowButton from "./FollowButton";
import LoginToFollowButton from "./LoginToFollowButton";
import Username from "./Username";
import { UserResult } from "@/lib/services/user";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserListItem({
	user: { handle, name, id, description, isFollowing },
}: {
	user: UserResult;
}) {
	const { data: session } = useSession();
	const userId = session ? Number(session.user?.id) : 0;

	return (
		<div>
			<Link href={`/${handle}`}>
				<Username name={name} handle={handle} />
				<Description description={description} />
			</Link>
			{userId && userId !== id ? (
				<FollowButton userId={id} initialIsFollowing={isFollowing} />
			) : null}
			{!userId ? <LoginToFollowButton /> : null}
		</div>
	);
}
