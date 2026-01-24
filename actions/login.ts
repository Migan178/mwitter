"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import * as z from "zod";

const invalid = "올바르지 않은 비밀번호나 이메일";

const formSchema = z.object({
	email: z.string().trim().min(1),
	password: z.string().trim().min(1),
});

export async function login(initialState: unknown, formData: FormData) {
	const { data, success } = formSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});
	if (!success) return invalid;

	try {
		await signIn("credentials", {
			...data,
		});
	} catch (err) {
		if (err instanceof AuthError) {
			switch (err.type) {
				case "CredentialsSignin":
					return invalid;
				default:
					return "알 수 없는 오류가 발생했어요.";
			}
		}

		throw err;
	}
}
