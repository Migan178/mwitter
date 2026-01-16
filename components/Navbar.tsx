"use client";

import useUserDataStore from "@/stores/userData";
import Link from "next/link";

export default function Navbar() {
	const handle = useUserDataStore(state => state.handle);
	const isProtected = useUserDataStore(state => state.protected);

	return (
		<aside className="fixed top-0 left-0">
			<nav className="flex w-100 flex-col gap-y-2 text-center">
				<Link href="/">
					<h1 className="text-2xl font-bold">Mwitter</h1>
				</Link>
				<Link href="/search">검색</Link>
				<Link href={`/${encodeURIComponent(handle)}`}>프로필</Link>
				{isProtected ? (
					<Link href="/follow-requests">팔로우 요청</Link>
				) : null}
				<Link href="/settings">설정</Link>
				<Link href="/notifications">알림</Link>
				<Link href="/posts/create">포스트 제작</Link>
			</nav>
		</aside>
	);
}
