"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleLike(formData: FormData) {
	const session = await auth();
	const postId = Number(formData.get("postId"));
	const authorId = Number(formData.get("authorId"));
	if (!session || isNaN(postId) || isNaN(authorId)) return;

	const userId = Number(session.user?.id);

	const data = {
		likerId: userId,
		postId,
	};
	try {
		const like = await prisma.like.findUnique({
			where: {
				postId_likerId: data,
			},
		});

		if (like) {
			await prisma.like.delete({
				where: {
					postId_likerId: data,
				},
			});

			if (userId === authorId) return;
			await prisma.notification.deleteMany({
				where: {
					senderId: userId,
					recipientId: authorId,
					type: "LIKE",
					postId,
				},
			});
			return;
		}

		await prisma.like.create({ data });

		if (userId === authorId) return;
		await prisma.notification.create({
			data: {
				senderId: userId,
				recipientId: authorId,
				type: "LIKE",
				postId,
			},
		});
	} catch (err) {
		console.log(err);
	}
}
