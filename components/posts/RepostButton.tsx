"use client";

import { toggleRepost } from "@/actions/toggleRepost";
import Form from "next/form";
import { useState } from "react";

export default function RepostButton({
	authorId,
	postId,
	initialReposted,
	initialReposts,
}: {
	authorId: number;
	postId: number;
	initialReposted: boolean;
	initialReposts: number;
}) {
	const [reposts, setReposts] = useState(initialReposts);
	const [isReposted, setReposted] = useState(initialReposted);

	function toggleButton() {
		if (isReposted) {
			setReposted(false);
			setReposts(reposts - 1);
			return;
		}

		setReposted(true);
		setReposts(reposts + 1);
	}

	return (
		<Form action={toggleRepost}>
			<input type="hidden" value={postId} name="postId" />
			<input type="hidden" value={authorId} name="authorId" />
			<button type="submit" onClick={toggleButton}>
				{reposts} {isReposted ? "재게시 취소" : "재게시"}
			</button>
		</Form>
	);
}
