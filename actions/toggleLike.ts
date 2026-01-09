"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as z from "zod";

const formSchema = z.object({
	postId: z.coerce.number().min(1),
	authorId: z.coerce.number().min(1),
});

export async function toggleLike(formData: FormData) {
	const session = await auth();
	if (!session || !session.user) return;

	const userId = Number(session.user.id);

	const { data, success } = formSchema.safeParse({
		postId: formData.get("postId"),
		authorId: formData.get("authorId"),
	});
	if (!success) return;

	const { postId, authorId } = data;

	try {
		const like = await prisma.like.findUnique({
			where: {
				postId_likerId: {
					likerId: userId,
					postId,
				},
			},
		});

		if (like) {
			await prisma.like.delete({
				where: {
					postId_likerId: {
						likerId: userId,
						postId,
					},
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

		await prisma.like.create({
			data: {
				likerId: userId,
				postId,
			},
		});

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
