"use client";

import { checkIdDuplication } from "@/actions/signup";
import { useState } from "react";

export default function IdInput({
	id,
	setId,
	setVerified,
}: {
	id: string;
	setId: (id: string) => void;
	setVerified: (verified: boolean) => void;
}) {
	const [isIdDuplicated, setIdIsDuplicated] = useState(false);
	const [isIdLowerLength, setIdLowerLength] = useState(true);
	const [isIdChecking, setIdIsChecking] = useState(false);

	async function verifyId() {
		setIdIsChecking(true);
		setIdLowerLength(false);
		setIdIsDuplicated(false);

		if (id.length < 4) {
			setIdLowerLength(true);
			setVerified(false);
		} else {
			const isDuplicated = await checkIdDuplication(id);
			setIdIsDuplicated(isDuplicated);
			setVerified(!isDuplicated);
		}

		setIdIsChecking(false);
	}

	return (
		<div>
			<label>ID</label>
			<input
				type="text"
				placeholder="당신이 사용할 ID"
				name="id"
				value={id}
				onChange={e => setId(e.target.value)}
				onBlur={verifyId}
				required
			/>
			{isIdChecking ? <p>검사 중...</p> : null}
			{isIdDuplicated ? (
				<p className="text-red-500">이미 사용된 ID</p>
			) : null}
			{id && isIdLowerLength ? (
				<p className="text-red-500">ID는 4 글자 이상으로</p>
			) : null}
			{!isIdChecking && !isIdDuplicated && !isIdLowerLength ? (
				<p className="text-green-500">사용 가능</p>
			) : null}
		</div>
	);
}
