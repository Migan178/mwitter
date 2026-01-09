"use client";

import useCreatePostStatusState from "@/stores/createPostStatus";
import { useRouter } from "next/navigation";
import { Chat } from "react-bootstrap-icons";

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
			<button className="post-button" onClick={moveToCreateReply}>
				<Chat />
				{replies}
			</button>
		</div>
	);
}
