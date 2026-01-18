"use client";

import { toggleProtected } from "@/actions/toggleProtected";
import useUserDataStore from "@/stores/userData";
import { startTransition, useActionState, useEffect } from "react";
import Switch from "react-switch";

export default function SetProtectedSwitch({
	setErrorMessage,
}: {
	setErrorMessage: (error: string | null) => void;
}) {
	const globalProtected = useUserDataStore(state => state.protected);
	const toggleGlobalProtected = useUserDataStore(
		state => state.toggleProtected,
	);

	const [success, action] = useActionState(toggleProtected, null);

	useEffect(() => {
		if (typeof success !== "boolean") return;

		if (!success) {
			toggleGlobalProtected();
			setErrorMessage("보호된 계정으로 변경하다 오류 발생");

			const timeout = setTimeout(() => setErrorMessage(null), 4000);

			return () => clearTimeout(timeout);
		}
	}, [setErrorMessage, success, toggleGlobalProtected]);

	function handleChange() {
		toggleGlobalProtected();

		startTransition(() => action(globalProtected));
	}

	return (
		<label className="w-full flex justify-between">
			<span className="text-xl font-semibold">계정 비공개</span>
			<Switch onChange={handleChange} checked={globalProtected} />
		</label>
	);
}
