"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleLike(formData: FormData) {
	const session = await auth();
	const postId = formData.get("postId");
	if (!session || !postId) return;

	const data = {
		likerId: Number(session.user?.id),
		postId: Number(postId),
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
			return;
		}

		await prisma.like.create({ data });
	} catch (err) {
		console.log(err);
	}
}
