"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import userMentionRegexp from "@/lib/regex/userMention";
import * as z from "zod";

const formSchema = z.object({
	content: z.string("내용이 없음").trim().min(1),
	parentId: z.coerce.number().nullable(),
});

export interface CreatePostResponse {
	success: boolean;
	error?: string;
}

export async function createPost(
	initialState: any,
	formData: FormData,
): Promise<CreatePostResponse> {
	const session = await auth();
	if (!session || !session.user || !session.user.id)
		return { success: false, error: "올바르지 않은 사용자" };
	const userId = Number(session.user.id);

	const validatedData = formSchema.safeParse({
		content: formData.get("content"),
		parentId: formData.get("parentId"),
	});
	if (!validatedData.success)
		return { success: false, error: validatedData.error.message };

	try {
		const newPost = await prisma.post.create({
			data: {
				parentId: validatedData.data.parentId,
				content: validatedData.data.content,
				authorId: userId,
			},
			include: {
				parent: true,
			},
		});

		if (newPost.parent && newPost.parent.authorId !== userId) {
			await prisma.notification.create({
				data: {
					recipientId: newPost.parent.authorId,
					senderId: userId,
					type: "REPLY",
					postId: newPost.id,
				},
			});
		}

		validatedData.data.content.split(/\ +/g).map(async part => {
			if (part.match(userMentionRegexp)) {
				const recipient = await prisma.user.findUnique({
					where: {
						handle: part.replace("@", ""),
					},
					select: {
						id: true,
					},
				});
				if (!recipient) return;

				await prisma.notification.create({
					data: {
						recipientId: recipient.id,
						senderId: userId,
						type: "MENTION",
						postId: newPost.id,
					},
				});
			}
		});
	} catch (err) {
		console.log(err);
		return { success: false, error: "포스트 작성 중 오류 발생" };
	}

	return { success: true };
}
