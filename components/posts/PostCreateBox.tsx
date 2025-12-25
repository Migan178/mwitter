"use client";

import useCreatePostStatusState from "@/stores/createPostStatus";
import { useRouter } from "next/navigation";

export default function PostCreateBox({ parentId }: { parentId?: number }) {
	const setPostId = useCreatePostStatusState(state => state.setPostId);
	const setContent = useCreatePostStatusState(state => state.setContent);
	const router = useRouter();

	function moveToCreatePost() {
		setPostId(parentId || null);
		setContent("");
		router.push("/posts/create");
	}

	return (
		<div>
			<button
				className="text-gray-500 hover:cursor-pointer"
				onClick={moveToCreatePost}
			>
				포스트 내용을 입력
			</button>
		</div>
	);
}
