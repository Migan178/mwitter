"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
