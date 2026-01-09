"use client";

import SearchBox from "./search/SearchBox";
import useUserDataStore from "@/stores/userData";
import Link from "next/link";

export default function Navbar() {
	const handle = useUserDataStore(state => state.handle);

	return (
		<aside className="fixed top-0 left-0">
			<nav className="flex w-100 flex-col gap-y-2 text-center">
				<Link href="/">
					<h1 className="text-2xl font-bold">Mwitter</h1>
				</Link>
				<SearchBox />
				<Link href={`/${encodeURIComponent(handle)}`}>프로필</Link>
				<Link href="/settings">설정</Link>
				<Link href="/notifications">알림</Link>
				<Link href="/posts/create">포스트 제작</Link>
			</nav>
		</aside>
	);
}
