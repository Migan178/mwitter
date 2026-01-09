"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import userMentionRegexp from "@/lib/regex/userMention";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import * as z from "zod";

const formSchema = z.object({
	content: z.string("내용이 없음").trim().min(1),
	parentId: z.coerce.number().nullable(),
	currentPath: z.string("올바르지 않은요청 URL").trim().min(1),
	images: z.array(z.instanceof(File)),
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
	if (!session || !session.user)
		return { success: false, error: "올바르지 않은 사용자" };

	const userId = Number(session.user.id);

	const files = formData.getAll("images");

	const { data, error, success } = formSchema.safeParse({
		content: formData.get("content"),
		parentId: formData.get("parentId"),
		currentPath: formData.get("currentPath"),
		images: files,
	});
	if (!success) return { success: false, error: error.message };

	const { content, currentPath, images: imagesData, parentId } = data;

	try {
		const images: { name: string; url: string; order: number }[] = [];

		if (imagesData.length) {
			/** @description 실제 파일이 저장될 경로 */
			const uploadPath = join(
				process.cwd(),
				"public",
				"uploads",
				"images",
			);
			/** @description DB에 저장할 경로 */
			const dbImagePath = join("/uploads", "images");

			await mkdir(uploadPath, { recursive: true });

			// 순서를 위해 index가 필요하므로 for of 사용 안함
			for (let i = 0; i < imagesData.length; i++) {
				const image = imagesData[i];
				const buffer = Buffer.from(await image.arrayBuffer());
				const filename = `${Date.now()}_image_${i}.${extname(image.name)}`;

				await writeFile(join(uploadPath, filename), buffer);

				images.push({
					order: i,
					name: filename,
					url: join(dbImagePath, filename),
				});
			}
		}

		const newPost = await prisma.post.create({
			data: {
				parentId,
				content: content,
				authorId: userId,
				images: {
					create: images,
				},
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

		content.split(/\ +/g).map(async part => {
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

	revalidatePath(currentPath);

	return { success: true };
}
