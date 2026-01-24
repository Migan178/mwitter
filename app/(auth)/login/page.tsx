"use client";

import { login } from "@/actions/login";
import EmailInput from "@/components/signup/EmailInput";
import PasswordInput from "@/components/signup/PasswordInput";
import Form from "next/form";
import { useActionState, useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [state, formAction, pending] = useActionState(login, null);

	return (
		<div className="flex items-center justify-center">
			<Form action={formAction}>
				<EmailInput email={email} setEmail={setEmail} />
				<PasswordInput password={password} setPassword={setPassword} />
				<button type="submit" disabled={pending}>
					로그인
				</button>
				{state ? <p className="text-red-500">{state}</p> : null}
			</Form>
		</div>
	);
}
