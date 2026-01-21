"use client";

import FollowForm from "../users/FollowForm";
import PostDeleteModal from "./PostDeleteModal";
import { UserResult } from "@/lib/services/user";
import useCreatePostStatusState from "@/stores/createPostStatus";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreeDotsVertical, Trash } from "react-bootstrap-icons";

export default function PostMenuButton({
	postId,
	postContent,
	author: {
		id: authorId,
		protected: authorProtected,
		handle: authorHandle,
		followStatus: authorFollowStatus,
	},
}: {
	postId: number;
	postContent: string;
	author: UserResult;
}) {
	const { data: session } = useSession();
	const router = useRouter();

	const setPostId = useCreatePostStatusState(state => state.setPostId);
	const setContent = useCreatePostStatusState(state => state.setContent);

	const [showMenu, setShowMenu] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	function handleEditPost() {
		setShowMenu(false);

		setPostId(postId);
		setContent(postContent);

		router.push("/posts/create");
	}

	function handleDeletePost() {
		setShowMenu(false);
		setShowDeleteModal(true);
	}

	return (
		<>
			<div className="relative">
				<button onClick={() => setShowMenu(!showMenu)}>
					<ThreeDotsVertical className="text-gray-500" />
				</button>
				<div
					className={`absolute top-3 right-4 p-4 bg-white z-20 min-w-40 max-w-fit shadow-2xl duration-200 ${showMenu ? "opacity-100" : "opacity-0 pointer-events-none z-0"}`}
				>
					{session && Number(session.user?.id) === authorId ? (
						<>
							<button onClick={handleEditPost}>
								게시글 수정
							</button>
							<button
								className="flex gap-x-1 justify-center items-center"
								onClick={handleDeletePost}
							>
								<Trash />
								게시글 삭제하기
							</button>
						</>
					) : (
						<>
							<FollowForm
								userId={authorId}
								protected={authorProtected}
							>
								<button
									type="submit"
									onClick={() => setShowMenu(false)}
								>
									@{authorHandle} 팔로우{" "}
									{authorFollowStatus === "FOLLOWING"
										? "취소"
										: null}
									{authorFollowStatus === "REQUESTED"
										? "요청 취소"
										: null}
									하기
								</button>
							</FollowForm>
							<button>@{authorHandle} 차단 하기</button>
						</>
					)}
				</div>
			</div>
			{showDeleteModal ? (
				<PostDeleteModal
					postId={postId}
					closeMenu={() => setShowDeleteModal(false)}
				/>
			) : null}
		</>
	);
}
