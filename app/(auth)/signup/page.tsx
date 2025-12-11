"use client";

import { createAccount } from "@/actions/signup";
import EmailInput from "@/components/signup/EmailInput";
import IdInput from "@/components/signup/IdInput";
import NameInput from "@/components/signup/NameInput";
import PasswordInput from "@/components/signup/PasswordInput";
import Form from "next/form";
import { useActionState, useState } from "react";

export default function SignUp() {
	const [isVerified, setVerified] = useState(true);
	const [state, formAction, pending] = useActionState(createAccount, null);

	return (
		<div className="grid h-screen items-center justify-center">
			<div>
				<Form action={formAction}>
					<IdInput setVerified={setVerified} />
					<EmailInput setVerified={setVerified} />
					<NameInput setVerified={setVerified} />
					<PasswordInput setVerified={setVerified} />
					<div>
						<input
							type="submit"
							value="회원가입 하기"
							className="hover:cursor-pointer"
							disabled={!isVerified || pending}
						/>
					</div>
					{state ? <p className="text-red-500">{state}</p> : null}
				</Form>
			</div>
		</div>
	);
}
