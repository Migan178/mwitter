"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleLike(formData: FormData) {
	const session = await auth();
	const postId = formData.get("postId");
	if (!session || !postId) return;

	const data = {
		where: {
			postId_likerId: {
				likerId: Number(session.user?.id),
				postId: Number(postId),
			},
		},
	};
	try {
		const like = await prisma.like.findUnique(data);

		if (like) {
			await prisma.like.delete(data);
			return;
		}

		await prisma.like.create({
			data: {
				likerId: Number(session.user?.id),
				postId: Number(postId),
			},
		});
	} catch (err) {
		console.log(err);
	}
}
