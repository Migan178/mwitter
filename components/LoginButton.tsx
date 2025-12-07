"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
	const className = "hover:cursor-pointer";
	const { status } = useSession();

	if (status === "authenticated") {
		return (
			<button className={className} onClick={() => signOut()}>
				log out
			</button>
		);
	}

	return (
		<button className={className} onClick={() => signIn()}>
			log in
		</button>
	);
}
