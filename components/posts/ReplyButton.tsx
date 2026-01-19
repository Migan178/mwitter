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
	const setParentId = useCreatePostStatusState(state => state.setParentId);
	const router = useRouter();

	function moveToCreateReply() {
		setParentId(postId);
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
