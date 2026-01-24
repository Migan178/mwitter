"use server";

import { signIn } from "@/lib/auth";
import { hashPassword } from "@/lib/hash";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import * as z from "zod";

const invalidPassword = "올바르지 않은 비밀번호";

const formSchema = z.object({
	id: z.string("올바르지 않은 ID").trim().min(1),
	name: z.string("올바르지 않은 이름").trim().min(1),
	email: z.string("올바르지 않은 email").trim().min(1),
	password: z.string(invalidPassword).trim().min(1),
	passwordCheck: z.string(invalidPassword).trim().min(1),
});

export async function createAccount(initialState: unknown, formData: FormData) {
	const { data, success, error } = formSchema.safeParse({
		id: formData.get("id"),
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		passwordCheck: formData.get("passwordCheck"),
	});

	if (!success) return error.message;

	const { id, name, email, password, passwordCheck } = data;
	if (password !== passwordCheck) return invalidPassword;

	const hashedPassword = await hashPassword(password);

	try {
		await prisma.user.create({
			data: {
				handle: id,
				name,
				email,
				hashedPassword,
			},
		});
	} catch (err) {
		console.log(err);
		return "회원가입 도중 오류 발생";
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false,
		});
	} catch (err) {
		console.log(err);
		return "회원가입 후 자동 로그인 도중 오류 발생. 수동 로그인 바람";
	}

	redirect("/");
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
