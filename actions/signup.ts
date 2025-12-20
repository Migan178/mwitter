"use server";

import { signIn } from "@/lib/auth";
import { hashPassword } from "@/lib/hash";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import * as z from "zod";

const formSchema = z.object({
	id: z.string("올바르지 않은 ID").trim().min(1),
	name: z.string("올바르지 않은 이름").trim().min(1),
	email: z.string("올바르지 않은 email").trim().min(1),
	password: z.string("올바르지 않은 비밀번호").trim().min(1),
});

export async function createAccount(initialState: any, formData: FormData) {
	const validatedData = formSchema.safeParse({
		id: formData.get("id"),
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validatedData.success) return validatedData.error.message;

	const hashedPassword = await hashPassword(validatedData.data.password);

	try {
		await prisma.user.create({
			data: {
				handle: validatedData.data.id,
				name: validatedData.data.name,
				email: validatedData.data.email,
				hashedPassword,
			},
		});
	} catch (err) {
		console.log(err);
		return "회원가입 도중 오류 발생";
	}

	try {
		await signIn("credentials", {
			email: validatedData.data.email,
			password: validatedData.data.password,
			redirect: false,
		});
	} catch (err) {
		console.log(err);
		return "회원가입 후 자동 로그인 도중 오류 발생. 수동 로그인 바람";
	}

	redirect("/signup/success");
}

export async function checkIdDuplication(id: string): Promise<boolean> {
	const data = await prisma.user.findUnique({
		where: {
			handle: id,
		},
	});

	return data !== null;
}

export async function checkEmailDuplication(email: string): Promise<boolean> {
	const data = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	return data !== null;
}
