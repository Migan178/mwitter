"use client";

import Post, { PostDataWithReplyCountProps } from "../posts/Post";
import UserListItem from "../users/UserListItem";
import { NotificationType } from "@/app/generated/prisma/enums";
import Link from "next/link";

export default function Notification({
	type,
	post,
	isRead,
	sender,
}: {
	type: NotificationType;
	post: PostDataWithReplyCountProps | null;
	isRead: boolean;
	sender: {
		isFollowing: boolean;
		id: number;
		handle: string;
		name: string;
	};
}) {
	return (
		<div>
			{isRead ? <p>(읽음)</p> : null}
			<div>
				{type === "LIKE" ? (
					<Link href={`/${post?.handle}/posts/${post?.id}`}>
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
							<UserListItem
								handle={sender.handle}
								name={sender.name}
								id={sender.id}
								isFollowing={sender.isFollowing}
							/>
						</div>
					</Link>
				) : null}
				{type === "MENTION" || type === "REPLY" ? (
					<Post
						authorId={post?.authorId!}
						id={post?.id!}
						user={post?.user!}
						handle={post?.handle!}
						content={post?.content!}
						createdAt={post?.createdAt!}
						likes={post?.likes!}
						liked={post?.liked!}
						replies={post?.replies!}
					/>
				) : null}
			</div>
		</div>
	);
}
