"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleRepost(formData: FormData) {
	const session = await auth();
	const postId = Number(formData.get("postId"));
	const authorId = Number(formData.get("authorId"));
	if (!session || isNaN(postId) || isNaN(authorId)) return;
	const userId = Number(session.user?.id);
	if (isNaN(userId)) return;

	try {
		const repost = await prisma.post.findMany({
			where: {
				authorId: userId,
				originalId: postId,
			},
		});

		if (repost.length > 0 && userId !== authorId) {
			await prisma.post.delete({
				where: {
					id: repost[0].id,
				},
			});

			return;
		}

		await prisma.post.create({
			data: {
				content: "",
				originalId: postId,
				authorId: userId,
			},
		});

		if (userId === authorId) return;
		await prisma.notification.create({
			data: {
				recipientId: authorId,
				senderId: userId,
				type: "REPOST",
				postId,
			},
		});
	} catch (err) {
		console.log(err);
	}
}
