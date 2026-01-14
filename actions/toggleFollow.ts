"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as z from "zod";

const formSchema = z.object({
	userId: z.coerce.number().min(1),
	protected: z.coerce.boolean(),
});

export async function toggleFollow(formData: FormData) {
	const session = await auth();
	if (!session || !session.user) return;

	const sessionId = Number(session.user.id);

	const { data, success } = formSchema.safeParse({
		userId: formData.get("userId"),
		protected: formData.get("protected"),
	});
	if (!session || !success) return;

	const { userId, protected: isProtected } = data;

	if (sessionId === userId) return;

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				follower: {
					select: {
						followerId: true,
					},
					where: {
						followerId: sessionId,
					},
				},
				followRequests: {
					select: {
						followerId: true,
					},
					where: {
						followerId: sessionId,
					},
				},
			},
		});

		if (!user) return;

		if (user.followRequests.length > 0) {
			prisma.followRequest.delete({
				where: {
					followerId_followingId: {
						followerId: sessionId,
						followingId: userId,
					},
				},
			});

			return;
		}

		if (user.follower.length > 0) {
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

		if (isProtected) {
			await prisma.followRequest.create({
				data: {
					followerId: sessionId,
					followingId: userId,
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
