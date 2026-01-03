"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import * as z from "zod";

const formSchema = z.object({
	description: z.string("올바르지 않은 설명").trim().nullable(),
	name: z.string("올바르지 않은 이름").trim().min(1),
});

export async function editProfile(initialState: any, formData: FormData) {
	const session = await auth();
	if (!session || !session.user || !session.user.id)
		return { success: false, error: "올바르지 않은 사용자" };

	const validatedData = formSchema.safeParse({
		description: formData.get("description"),
		name: formData.get("name"),
	});

	if (!validatedData.success) {
		console.log(validatedData.error);
		return {
			success: false,
			message: validatedData.error.message,
		};
	}

	const profile = formData.get("profile");
	const prevProfile = formData.get("prevProfile");

	// 프로필 사진에 변화가 없을 때
	if (profile === prevProfile) {
		try {
			await prisma.user.update({
				where: {
					id: Number(session.user.id),
				},
				data: {
					description: validatedData.data.description,
					name: validatedData.data.name,
				},
			});
		} catch (err) {
			console.log(err);
			return {
				success: false,
				message: "프로필 수정 중 문제 발생.",
			};
		}

		return {
			success: true,
			message: null,
		};
	}

	// 프로필 사진에 변화가 있을 때
	const profileFile = profile as File;
	/** @description DB에 저장할 경로 */
	const dbProfilePath = join("/uploads", "profile", profileFile.name);
	/** @description 실제 파일이 저장될 경로 */
	const uploadPath = join(process.cwd(), "public", "uploads", "profile");
	const buffer = Buffer.from(await profileFile.arrayBuffer());

	try {
		await mkdir(uploadPath, { recursive: true });
		await writeFile(join(uploadPath, profileFile.name), buffer);

		await prisma.user.update({
			where: {
				id: Number(session.user.id),
			},
			data: {
				profile: dbProfilePath,
				description: validatedData.data.description,
				name: validatedData.data.name,
			},
		});
	} catch (err) {
		console.log(err);
		return {
			success: false,
			message: "프로필 수정 중 문제 발생.",
		};
	}

	return {
		success: true,
		message: null,
	};
}
