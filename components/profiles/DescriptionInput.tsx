"use client";

import { useState } from "react";

export default function DescriptionInput({
	description,
	setDescription,
	setVerified,
}: {
	description: string;
	setDescription: (description: string) => void;
	setVerified: (verified: boolean) => void;
}) {
	const [isOverLength, setOverLength] = useState(false);

	function checkLength() {
		if (!description) {
			setOverLength(false);
			setVerified(false);
			return;
		}

		if (description.length > 200) {
			setOverLength(true);
			setVerified(false);
			return;
		}

		setOverLength(false);
		setVerified(true);
	}

	return (
		<div>
			<label>설명</label>
			<input
				type="text"
				placeholder="당신의 설명"
				name="description"
				value={description}
				onChange={e => setDescription(e.target.value)}
				onBlur={checkLength}
			/>
			{isOverLength ? (
				<p className="text-red-500">200자 보다 긴 설명</p>
			) : null}
		</div>
	);
}
