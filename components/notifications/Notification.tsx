"use client";

import Post from "../posts/Post";
import UserListItem from "../users/UserListItem";
import { NotificationType } from "@/app/generated/prisma/enums";
import { PostResult } from "@/lib/services/post";
import { UserResult } from "@/lib/services/user";
import Link from "next/link";

export default function Notification({
	notification: { type, post, isRead, sender },
}: {
	notification: {
		type: NotificationType;
		post: PostResult | null;
		isRead: boolean;
		sender: UserResult;
	};
}) {
	return (
		<div>
			{isRead ? <p>(읽음)</p> : null}
			<div>
				{type === "LIKE" ? (
					<Link href={`/${post?.author.handle}/posts/${post?.id}`}>
						<Link href={`/${sender.handle}`}>
							<p>{sender.name}님이 당신의 게시물을 좋아합니다.</p>
							<p>{post?.content}</p>
						</Link>
					</Link>
				) : null}
				{type === "FOLLOW" ? (
					<Link href={`/${sender.handle}`}>
						<p>{sender.name}님이 당신을 팔로우 합니다.</p>
						<div>
							<UserListItem user={sender} />
						</div>
					</Link>
				) : null}
				{type === "MENTION" || type === "REPLY" ? (
					<Post post={post!} />
				) : null}
			</div>
		</div>
	);
}
