"use client";

import UserProfile from "../users/UserProfile";
import useCreatePostStatusState from "@/stores/createPostStatus";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostCreateBox({ parentId }: { parentId?: number }) {
	const { data: session } = useSession();
	const setPostId = useCreatePostStatusState(state => state.setPostId);
	const setContent = useCreatePostStatusState(state => state.setContent);
	const router = useRouter();

	if (!session || !session.user) return null;

	function moveToCreatePost() {
		setPostId(parentId || null);
		setContent("");
		router.push("/posts/create");
	}

	return (
		<div className="p-2 flex gap-x-2">
			<UserProfile profile={session.user.profile} size={40} />
			<button
				className="text-gray-500 hover:cursor-pointer"
				onClick={moveToCreatePost}
			>
				포스트 내용을 입력
			</button>
		</div>
	);
}
