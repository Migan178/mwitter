"use client";

import LoginButton from "./LoginButton";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="flex justify-between">
			<Link href="/">
				<h1>Mwitter</h1>
			</Link>
			<LoginButton />
		</nav>
	);
}
