"use client";

import useUserDataStore from "@/stores/userData";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
	Bell,
	BoxArrowRight,
	Feather,
	Gear,
	Person,
	PersonPlusFill,
	Search,
} from "react-bootstrap-icons";

export default function Navbar() {
	const handle = useUserDataStore(state => state.handle);
	const isProtected = useUserDataStore(state => state.protected);

	return (
		<aside className="fixed top-0 left-0">
			<nav className="w-100 h-screen">
				<Link href="/">
					<h1 className="text-2xl font-bold text-center py-8">
						Mwitter
					</h1>
				</Link>
				<Link href="/search" className="navbar-icon">
					<Search />
					검색
				</Link>
				<Link
					href={`/${encodeURIComponent(handle)}`}
					className="navbar-icon"
				>
					<Person />
					프로필
				</Link>
				{isProtected ? (
					<Link href="/follow-requests" className="navbar-icon">
						<PersonPlusFill />
						팔로우 요청
					</Link>
				) : null}
				<Link href="/settings" className="navbar-icon">
					<Gear />
					설정
				</Link>
				<Link href="/notifications" className="navbar-icon">
					<Bell />
					알림
				</Link>
				<Link href="/posts/create" className="navbar-icon">
					<Feather />
					포스트 제작
				</Link>
				<button
					className="navbar-icon w-full"
					onClick={() => signOut()}
				>
					<BoxArrowRight />
					로그아웃
				</button>
			</nav>
		</aside>
	);
}
