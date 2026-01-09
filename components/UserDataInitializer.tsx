"use client";

import { type ProfileResult } from "@/lib/services/user";
import useUserDataStore from "@/stores/userData";
import { useSession } from "next-auth/react";

export default function UserDataInitializer({
	children,
	user,
}: {
	children: React.ReactNode;
	user: ProfileResult | null;
}) {
	// 인증된 상태인지 아닌지 확인하기 위해 useSession 사용. (어차피 인증은 최상위 layout에서 진행하기에 상태만 필요.)
	const { status } = useSession();
	// Context API를 사용할 수도 있지만, zustand가 장점이 많아 zustand 기반으로 작성 함.
	const setName = useUserDataStore(state => state.setName);
	const setProfile = useUserDataStore(state => state.setProfile);
	const setHandle = useUserDataStore(state => state.setHandle);

	if (status === "authenticated" && user) {
		setName(user.name);
		setProfile(user.profile);
		setHandle(user.handle);
	}

	return children;
}
