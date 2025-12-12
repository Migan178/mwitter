"use client";

import { checkEmailDuplication } from "@/actions/signup";
import { useState } from "react";

export default function EmailInput({
	email,
	setEmail,
	setVerified,
}: {
	email: string;
	setEmail: (email: string) => void;
	setVerified: (verified: boolean) => void;
}) {
	const [isEmailDuplicated, setEmailIsDuplicated] = useState(false);
	const [isEmailChecking, setEmailIsChecking] = useState(false);

	async function verifyEmail() {
		setEmailIsChecking(true);
		setEmailIsDuplicated(false);

		const isDuplicated = await checkEmailDuplication(email);
		setEmailIsDuplicated(isDuplicated);
		setVerified(!isDuplicated);

		setEmailIsChecking(false);
	}

	return (
		<div>
			<label>email</label>
			<input
				type="email"
				placeholder="당신이 사용할 email"
				name="email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				onBlur={verifyEmail}
				required
			/>
			{isEmailChecking ? <p>검사 중...</p> : null}
			{isEmailDuplicated ? (
				<p className="text-red-500">이미 사용된 email</p>
			) : null}
			{email && !isEmailChecking && !isEmailDuplicated ? (
				<p className="text-green-500">사용 가능</p>
			) : null}
		</div>
	);
}
