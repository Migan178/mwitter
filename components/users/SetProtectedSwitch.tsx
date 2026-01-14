"use client";

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
	const [success, action] = useActionState(toggleProtected, true);

	useEffect(() => {
		if (!success) {
			setLocalProtected(!localProtected);
			return;
		}

		toggleGlobalProtected();
	}, [success]);

	function handleChange() {
		setLocalProtected(!localProtected);
		action(localProtected);
	}

	return (
		<label className="w-full flex justify-between">
			<span className="text-xl">계정 비공개</span>
			<Switch onChange={handleChange} checked={localProtected} />
		</label>
	);
}
