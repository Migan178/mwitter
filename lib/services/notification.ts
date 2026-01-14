import prisma from "../prisma";
import {
	getQueryWithLikesAndReplyCount,
	refineSinglePost,
	type PostResult,
} from "./post";
import { getUserQuery, refineSingleUser, type UserResult } from "./user";
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
					...getUserQuery(recipientId),
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
		sender: refineSingleUser(sender),
		post: post ? refineSinglePost(post) : null,
	}));
}
