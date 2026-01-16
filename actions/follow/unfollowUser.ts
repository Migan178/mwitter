"use server";

import type { FollowData } from "./type";
import prisma from "@/lib/prisma";

export async function unfollowUser(data: FollowData) {
	await prisma.following.delete({
		where: {
			followerId_followingId: data,
		},
	});

	await prisma.notification.deleteMany({
		where: {
			senderId: data.followerId,
			recipientId: data.followingId,
			type: "FOLLOW",
		},
	});
}
