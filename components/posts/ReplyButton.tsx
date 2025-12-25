"use client";

import useCreatePostStatusState from "@/stores/createPostStatus";
import { useRouter } from "next/navigation";

export default function ReplyButton({
	postId,
	replies,
}: {
	postId: number;
	replies: number;
}) {
	const setPostId = useCreatePostStatusState(state => state.setPostId);
	const router = useRouter();

	function moveToCreateReply() {
		setPostId(postId);
		router.push("/posts/create");
	}

	return (
		<div>
			<button
				className="hover:cursor-pointer"
				onClick={moveToCreateReply}
			>
				답글 {replies}
			</button>
		</div>
	);
}
