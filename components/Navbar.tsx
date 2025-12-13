"use client";

import { redirect, useRouter } from "next/navigation";
import LoginButton from "./LoginButton";

export default function Navbar() {
	const router = useRouter();

	return (
		<nav className="flex justify-between">
			<button
				className="hover:cursor-pointer"
				onClick={() => router.push("/")}
			>
				<h1>Mwitter</h1>
			</button>
			<LoginButton />
		</nav>
	);
}
