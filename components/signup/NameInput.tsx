"use client";

import { useState } from "react";

export default function NameInput({
	name,
	setName,
	setVerified,
}: {
	name: string;
	setName: (name: string) => void;
	setVerified: (verified: boolean) => void;
}) {
	const [isNameLowerLength, setNameIsLowerLength] = useState(true);

	function checkName() {
		if (name.length < 4) {
			setNameIsLowerLength(true);
			setVerified(false);
			return;
		}

		setNameIsLowerLength(false);
		setVerified(true);
	}

	return (
		<div>
			<label>이름</label>
			<input
				type="text"
				placeholder="당신이 사용할 이름"
				name="name"
				value={name}
				onChange={e => setName(e.target.value)}
				onBlur={checkName}
				required
			/>
			{isNameLowerLength ? (
				<p className="text-red-500">이름은 4글자 이상으로</p>
			) : null}
		</div>
	);
}
