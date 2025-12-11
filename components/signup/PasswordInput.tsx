"use client";

import { useState } from "react";

export default function PasswordInput({
	setVerified,
}: {
	setVerified: (verified: boolean) => void;
}) {
	const [password, setPassword] = useState("");
	const [passwordCheck, setPasswordCheck] = useState("");
	const [isPasswordPassed, setPasswordIsPassed] = useState(false);

	function checkPassword() {
		if (!password || !passwordCheck) {
			setPasswordIsPassed(false);
			setVerified(false);
			return;
		}

		const isPassed = password === passwordCheck;
		setPasswordIsPassed(isPassed);
		setVerified(isPassed);
	}

	return (
		<div>
			<div>
				<label>비밀번호</label>
				<input
					type="password"
					placeholder="당신이 사용할 비밀번호"
					name="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					onBlur={checkPassword}
					required
				/>
			</div>
			<div>
				<label>비밀번호 확인</label>
				<input
					type="password"
					placeholder="비밀번호 확인"
					value={passwordCheck}
					onChange={e => setPasswordCheck(e.target.value)}
					onBlur={checkPassword}
					required
				/>
			</div>
			{!isPasswordPassed ? (
				<p className="text-red-500">올바르지 않은 비밀번호</p>
			) : (
				<p className="text-green-500">올바른 비밀번호</p>
			)}
		</div>
	);
}
