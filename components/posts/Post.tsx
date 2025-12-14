"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { LikeButton } from "./LikeButton";
import Username from "../users/Username";
import Link from "next/link";

export default function Post({
	user,
	handle,
	content,
	createdAt,
	id,
	likes,
	liked,
}: {
	user: string;
	handle: string;
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
				<div>
					<Link href={`/${handle}`}>
						<Username name={user} handle={handle} />
					</Link>
				</div>
				<div>
					<Link href={`/${handle}/posts/${id}`}>
						<h2 className="whitespace-pre-wrap">{content}</h2>
					</Link>
				</div>
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
