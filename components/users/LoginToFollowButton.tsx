"use client";

import { signIn } from "next-auth/react";

export default function LoginToFollowButton() {
	return <button onClick={() => signIn()}>팔로우 할려면 로그인하기</button>;
}
