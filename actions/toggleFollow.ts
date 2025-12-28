"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleFollow(formData: FormData) {
	const session = await auth();
	const userId = formData.get("userId");
	if (!session || !userId) return;

	const data = {
		followerId: Number(session.user?.id),
		followingId: Number(userId),
	};
	try {
		const follow = await prisma.following.findUnique({
			where: {
				followerId_followingId: data,
			},
		});

		if (follow) {
			await prisma.following.delete({
				where: {
					followerId_followingId: data,
				},
			});

			await prisma.notification.deleteMany({
				where: {
					senderId: Number(session.user?.id),
					recipientId: Number(userId),
					type: "FOLLOW",
				},
			});
			return;
		}

		await prisma.following.create({ data });

		await prisma.notification.create({
			data: {
				senderId: Number(session.user?.id),
				recipientId: Number(userId),
				type: "FOLLOW",
			},
		});
	} catch (err) {
		console.log(err);
	}
}
