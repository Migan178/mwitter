"use client";

import { useState } from "react";

export default function PasswordInput({
	password,
	checkValid = false,
	setPassword,
	setVerified = () => {},
}: {
	password: string;
	checkValid?: boolean;
	setPassword: (password: string) => void;
	setVerified?: (verified: boolean) => void;
}) {
	const [isValid, setValid] = useState(false);

	function handleBlur() {
		if (checkValid) {
			const isValid = password.length > 0;
			setVerified(isValid);
			setValid(isValid);
		}
	}

	return (
		<div>
			<label>비밀번호</label>
			<input
				type="password"
				placeholder="당신이 사용할 비밀번호"
				name="password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				onBlur={handleBlur}
				required
			/>
			{checkValid && !isValid ? (
				<p className="text-red-500">올바르지 않은 비밀번호</p>
			) : null}
			{checkValid && isValid ? (
				<p className="text-green-500">올바른 비밀번호</p>
			) : null}
		</div>
	);
}
