"use client";

import { useState } from "react";

export default function PasswordCheckInput({
	password,
	passwordCheck,
	setPasswordCheck,
	setVerified = () => {},
}: {
	password: string;
	passwordCheck: string;
	setVerified?: (verified: boolean) => void;
	setPasswordCheck: (password: string) => void;
}) {
	const [isSamePassword, setSamePassword] = useState(false);

	function handleCheckPassword() {
		if (!password || !passwordCheck) {
			setSamePassword(false);
			setVerified(false);
			return;
		}

		const isSame = password === passwordCheck;
		setSamePassword(isSame);
		setVerified(isSame);
	}

	return (
		<div>
			<label>비밀번호 확인</label>
			<input
				type="password"
				name="passwordCheck"
				value={passwordCheck}
				onChange={e => setPasswordCheck(e.target.value)}
				onBlur={handleCheckPassword}
				required
			/>
			{!isSamePassword ? (
				<p className="text-red-500">올바르지 않은 비밀번호</p>
			) : (
				<p className="text-green-500">올바른 비밀번호</p>
			)}
		</div>
	);
}
