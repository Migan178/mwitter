"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
	console.log(formData.get("parentId"));
	const session = await auth();
	if (!session || !session.user || !session.user.id)
		return { success: false, error: "올바르지 않은 사용자" };

	const validatedData = formSchema.safeParse({
		content: formData.get("content"),
		parentId: formData.get("parentId"),
	});
	if (!validatedData.success)
		return { success: false, error: validatedData.error.message };

	try {
		await prisma.post.create({
			data: {
				parentId: validatedData.data.parentId,
				content: validatedData.data.content,
				authorId: Number(session.user.id),
			},
		});
	} catch (err) {
		console.log(err);
		return { success: false, error: "포스트 작성 중 오류 발생" };
	}

	return { success: true };
}
