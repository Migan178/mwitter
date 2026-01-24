"use client";

import { createAccount } from "@/actions/signup";
import EmailInput from "@/components/signup/EmailInput";
import IdInput from "@/components/signup/IdInput";
import NameInput from "@/components/signup/NameInput";
import PasswordCheckInput from "@/components/signup/PasswordCheckInput";
import PasswordInput from "@/components/signup/PasswordInput";
import Form from "next/form";
import { useActionState, useState } from "react";

export default function SignUp() {
	const [isVerified, setVerified] = useState(true);
	const [state, formAction, pending] = useActionState(createAccount, null);
	const [id, setId] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");

	return (
		<div className="grid h-screen items-center justify-center">
			<div>
				<Form action={formAction}>
					<IdInput id={id} setId={setId} setVerified={setVerified} />
					<EmailInput
						email={email}
						setEmail={setEmail}
						setVerified={setVerified}
						checkValid
					/>
					<NameInput
						name={name}
						setName={setName}
						setVerified={setVerified}
					/>
					<PasswordInput
						password={password}
						setPassword={setPassword}
						setVerified={setVerified}
						checkValid
					/>
					<PasswordCheckInput
						password={password}
						passwordCheck={passwordCheck}
						setPasswordCheck={setPasswordCheck}
						setVerified={setVerified}
					/>
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
