import prisma from "../prisma";
import { getQueryWithLikesAndReplyCount, type PostResult } from "./post";
import { UserResult } from "./user";
import type { NotificationType } from "@/app/generated/prisma/enums";

export interface NotificationResult {
	id: number;
	isRead: boolean;
	type: NotificationType;
	sender: UserResult;
	post: PostResult | null;
}

export async function getNotificationsByRecipientId(
	recipientId: number,
): Promise<NotificationResult[]> {
	const notifications = await prisma.notification.findMany({
		where: {
			recipientId,
		},
		select: {
			id: true,
			isRead: true,
			type: true,
			post: {
				select: getQueryWithLikesAndReplyCount(recipientId),
			},
			sender: {
				select: {
					id: true,
					name: true,
					handle: true,
					description: true,
					follower: {
						select: {
							followerId: true,
						},
						where: {
							followerId: recipientId,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return notifications.map(({ id, isRead, type, post, sender }) => ({
		id,
		isRead,
		type,
		sender: {
			id: sender.id,
			name: sender.name,
			handle: sender.handle,
			description: sender.description,
			isFollowing: sender.follower.length > 0,
		},
		post: post
			? {
					id: post.id,
					content: post.content,
					author: post.author,
					isLiked: post.likes.length > 0,
					isReposted: post.reposts.length > 0,
					likeCount: post._count.likes,
					replyCount: post._count.replies,
					repostCount: post._count.reposts,
					parentAuthor: post.parent?.author.handle,
					createdAt: post.createdAt,
				}
			: null,
	}));
}
