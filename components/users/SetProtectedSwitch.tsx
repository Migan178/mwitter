"use client";

import ToastAlert from "../ToastAlert";
import { toggleProtected } from "@/actions/toggleProtected";
import useUserDataStore from "@/stores/userData";
import { useActionState, useEffect, useState } from "react";
import Switch from "react-switch";

export default function SetProtectedSwitch() {
	const globalProtected = useUserDataStore(state => state.protected);
	const toggleGlobalProtected = useUserDataStore(
		state => state.toggleProtected,
	);

	const [localProtected, setLocalProtected] = useState(globalProtected);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [success, action] = useActionState(toggleProtected, null);

	useEffect(() => {
		if (typeof success !== "boolean") return;

		if (!success) {
			setLocalProtected(!localProtected);
			setErrorMessage("보호된 계정으로 변경하다 오류 발생");

			const timeout = setTimeout(() => setErrorMessage(null), 4000);

			return () => clearTimeout(timeout);
		}

		toggleGlobalProtected();
	}, [success]);

	function handleChange() {
		setLocalProtected(!localProtected);
		action(localProtected);
	}

	return (
		<>
			<label className="w-full flex justify-between">
				<span className="text-xl">계정 비공개</span>
				<Switch onChange={handleChange} checked={localProtected} />
			</label>
			{errorMessage ? <ToastAlert>{errorMessage}</ToastAlert> : null}
		</>
	);
}
