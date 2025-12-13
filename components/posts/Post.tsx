"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { LikeButton } from "./LikeButton";

export default function Post({
	user,
	content,
	createdAt,
	id,
	likes,
	liked,
}: {
	user: string;
	content: string;
	createdAt: Date;
	id: number;
	likes: number;
	liked: boolean;
}) {
	dayjs.extend(relativeTime);
	dayjs.locale("ko");

	return (
		<li key={id}>
			<div>
				<h1>{user}</h1>
				<h2>{content}</h2>
				<p>{dayjs(createdAt).fromNow()}</p>
				<div>
					<LikeButton
						postId={id}
						initialLiked={liked}
						initialLikes={likes}
					/>
				</div>
			</div>
		</li>
	);
}
