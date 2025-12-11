"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
	const className = "hover:cursor-pointer";
	const { status } = useSession();

	if (status === "authenticated") {
		return (
			<button className={className} onClick={() => signOut()}>
				로그아웃
			</button>
		);
	}

	return (
		<div>
			<button
				className={className}
				onClick={() => (window.location.href = "/signup")}
			>
				회원가입
			</button>
			<button className={className} onClick={() => signIn()}>
				로그인
			</button>
		</div>
	);
}
