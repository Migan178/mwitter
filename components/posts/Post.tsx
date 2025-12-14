"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { LikeButton } from "./LikeButton";
import { useRouter } from "next/navigation";
import Username from "../users/Username";

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

	const router = useRouter();

	return (
		<li key={id}>
			<div>
				<div>
					<button
						className="hover:cursor-pointer"
						onClick={() => router.push(`/${handle}`)}
					>
						<Username name={user} handle={handle} />
					</button>
				</div>
				<div>
					<button
						className="hover:cursor-pointer"
						onClick={() => router.push(`/${handle}/posts/${id}`)}
					>
						<h2 className="whitespace-pre-wrap">{content}</h2>
					</button>
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
