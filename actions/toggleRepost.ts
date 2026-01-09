"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import * as z from "zod";

const formSchema = z.object({
	postId: z.coerce.number().min(1),
	authorId: z.coerce.number().min(1),
});

export async function toggleRepost(formData: FormData) {
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
