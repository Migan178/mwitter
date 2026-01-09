"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as z from "zod";

export async function toggleFollow(formData: FormData) {
	const session = await auth();
	if (!session || !session.user) return;

	const sessionId = Number(session.user.id);

	const { data: userId, success } = z.coerce
		.number()
		.min(1)
		.safeParse(formData.get("userId"));
	if (!session || !success || sessionId === userId) return;

	try {
		const follow = await prisma.following.findUnique({
			where: {
				followerId_followingId: {
					followerId: sessionId,
					followingId: userId,
				},
			},
		});

		if (follow) {
			await prisma.following.delete({
				where: {
					followerId_followingId: {
						followerId: sessionId,
						followingId: userId,
					},
				},
			});

			await prisma.notification.deleteMany({
				where: {
					senderId: sessionId,
					recipientId: userId,
					type: "FOLLOW",
				},
			});
			return;
		}

		await prisma.following.create({
			data: {
				followerId: sessionId,
				followingId: userId,
			},
		});

		await prisma.notification.create({
			data: {
				senderId: sessionId,
				recipientId: userId,
				type: "FOLLOW",
			},
		});
	} catch (err) {
		console.log(err);
	}
}
