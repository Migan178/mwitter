"use client";

import FollowForm from "../users/FollowForm";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";

export default function PostMenuButton({
	postId,
	authorId,
	authorHandle,
	isFollowingAuthor,
}: {
	postId: number;
	authorId: number;
	authorHandle: string;
	isFollowingAuthor: boolean;
}) {
	const [showMenu, setShowMenu] = useState(false);
	const { data: session } = useSession();

	return (
		<div className="relative">
			<button onClick={() => setShowMenu(!showMenu)}>
				<ThreeDotsVertical className="text-gray-500" />
			</button>
			<div
				className={`absolute top-3 right-4 p-4 bg-white z-20 min-w-40 max-w-fit shadow-2xl duration-200 ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none z-0"}`}
			>
				{session && Number(session.user?.id) === authorId ? (
					<>
						<button>게시글 수정</button>
						<button>게시글 삭제</button>
					</>
				) : (
					<>
						<FollowForm userId={authorId}>
							<button
								type="submit"
								onClick={() => setShowMenu(!showMenu)}
							>
								@{authorHandle} 팔로우{" "}
								{isFollowingAuthor ? "취소" : null}하기
							</button>
						</FollowForm>
						<button>@{authorHandle} 차단 하기</button>
					</>
				)}
			</div>
		</div>
	);
}
