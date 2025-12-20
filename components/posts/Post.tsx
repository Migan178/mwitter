"use client";

import Username from "../users/Username";
import { LikeButton } from "./LikeButton";
import hashTagRegexp from "@/lib/regex/hashTag";
import userMentionRegexp from "@/lib/regex/userMention";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
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

	const parts = content.split(/\ +/g);

	return (
		<div>
			<div>
				<Link href={`/${handle}`}>
					<Username name={user} handle={handle} />
				</Link>
			</div>
			<div>
				<Link href={`/${handle}/posts/${id}`}>
					<h2 className="whitespace-pre-wrap">
						{parts.map((part, i) => {
							if (part.match(userMentionRegexp)) {
								return (
									<Link
										href={`/${part.replace("@", "")}`}
										key={i}
										className="mr-1 text-blue-500"
									>
										{part}
									</Link>
								);
							}

							if (part.match(hashTagRegexp)) {
								return (
									<Link
										href={{
											pathname: "/search",
											query: { q: part },
										}}
										key={i}
										className="mr-1 text-blue-500"
									>
										{part}
									</Link>
								);
							}

							return part;
						})}
					</h2>
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
	);
}
