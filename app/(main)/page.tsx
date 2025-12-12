"use client";

import CreatePost from "@/components/posts/CreatePost";
import { useSession } from "next-auth/react";

export default function Home() {
	const { status } = useSession();

	return (
		<div>
			<h1 className="text-3xl font-bold">Hello, World!</h1>
			{status === "authenticated" ? <CreatePost /> : null}
		</div>
	);
}
