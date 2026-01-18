"use client";

import ToastAlert from "@/components/ToastAlert";
import SetProtectedSwitch from "@/components/users/SetProtectedSwitch";
import { useState } from "react";

export default function SetProtectedPage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	return (
		<>
			<div className="w-140 p-4">
				<SetProtectedSwitch setErrorMessage={setErrorMessage} />
				<p>
					계정을 보호된 계정으로 설정하면, 아무나 게시글을 볼 수
					없습니다. 또한 당신을 팔로우하기 위해서는 요청을 수락해야
					합니다.
				</p>
			</div>
			{errorMessage ? <ToastAlert>{errorMessage}</ToastAlert> : null}
		</>
	);
}
