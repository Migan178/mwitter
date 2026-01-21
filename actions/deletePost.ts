"use server";

import { Response } from "./types";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as z from "zod";

const formSchema = z.object({
	postId: z.coerce.number("올바르지 않은 게시글 ID").min(1),
	currentPath: z.string("올바르지 않은 URL"),
});

const NoPermissionOrNoPostErrorMsg = "권한이 없거나 존재하지 않는 게시물.";

export async function deletePost(
	initialState: unknown,
	formData: FormData,
): Promise<Response> {
	const session = await auth();
	if (!session || !session.user)
		return {
			success: false,
			error: "올바르지 않은 사용자",
		};
	const userId = Number(session.user.id);

	const { data, success, error } = formSchema.safeParse({
		postId: formData.get("postId"),
		currentPath: formData.get("currentPath"),
	});

	if (!success)
		return {
			success: false,
			error: error.message,
		};

	const { postId, currentPath } = data;

	try {
		await prisma.$transaction(async tx => {
			const result = await tx.post.updateMany({
				where: {
					id: postId,
					authorId: userId,
				},
				data: {
					deleteAt: new Date(),
				},
			});
			if (!result.count) throw new Error(NoPermissionOrNoPostErrorMsg);

			await tx.post.deleteMany({
				where: {
					originalId: postId,
					content: "",
				},
			});

			await tx.like.deleteMany({
				where: {
					postId,
				},
			});

			await tx.notification.deleteMany({
				where: {
					recipientId: userId,
					postId,
				},
			});
		});
	} catch (err) {
		if (
			err instanceof Error &&
			err.message === NoPermissionOrNoPostErrorMsg
		) {
			return {
				success: false,
				error: err.message,
			};
		}

		console.error(err);
		return { success: false, error: "오류가 발생함." };
	}

	revalidatePath(currentPath);

	return {
		success: true,
	};
}
