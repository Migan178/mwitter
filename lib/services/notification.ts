import prisma from "../prisma";
import { getQueryWithLikesAndReplyCount } from "./post";

export async function getNotificationsByRecipientId(recipientId: number) {
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
			isFollowing: sender.follower.length > 0,
		},
		post: post
			? {
					authorId: post.author.id,
					id: post.id,
					content: post.content,
					handle: post.author.handle,
					user: post.author.name,
					liked: post.likes.length > 0,
					likes: post._count.likes,
					replies: post._count.replies,
					createdAt: post.createdAt,
				}
			: null,
	}));
}

export type NotificationsResult = Awaited<
	ReturnType<typeof getNotificationsByRecipientId>
>;
