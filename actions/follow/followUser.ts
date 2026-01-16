"use server";

import type { FollowData } from "./type";
import prisma from "@/lib/prisma";

export async function followUser(data: FollowData) {
	await prisma.following.create({ data });

	await prisma.notification.create({
		data: {
			senderId: data.followerId,
			recipientId: data.followingId,
			type: "FOLLOW",
		},
	});
}
