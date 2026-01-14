"use client";

import Description from "./Description";
import FollowButton from "./FollowButton";
import LoginToFollowButton from "./LoginToFollowButton";
import UserProfile from "./UserProfile";
import Username from "./Username";
import { type UserResult } from "@/lib/services/user";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserListItem({
	user: {
		handle,
		name,
		id,
		description,
		followStatus: isFollowing,
		profile,
		protected: isProtected,
	},
}: {
	user: UserResult;
}) {
	const { data: session } = useSession();
	const userId = session ? Number(session.user?.id) : 0;

	return (
		<div className="flex justify-between">
			<div className="flex gap-x-2">
				<Link
					href={`/${handle}`}
					className="duration-250 hover:brightness-80"
				>
					<UserProfile profile={profile} size={40} />
				</Link>
				<Link href={`/${handle}`} className="hover:underline">
					<Username
						name={name}
						handle={handle}
						isProtected={isProtected}
					/>
					<Description description={description} />
				</Link>
			</div>
			{userId && userId !== id ? (
				<FollowButton
					userId={id}
					protected={isProtected}
					initialFollowStatus={isFollowing}
				/>
			) : null}
			{!userId ? <LoginToFollowButton /> : null}
		</div>
	);
}
