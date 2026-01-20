"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PostCreatedAt({
	createdAt,
	isEdited,
	postId,
	authorHandle,
}: {
	createdAt: Date;
	isEdited: boolean;
	postId: number;
	authorHandle: string;
}) {
	dayjs.extend(relativeTime);
	dayjs.locale("ko");

	const searchParams = useSearchParams();

	const relativeCreatedAt = dayjs(createdAt).fromNow();
	const version = Number(searchParams.get("v") ?? 0);

	if (isEdited)
		return (
			<Link
				href={{
					pathname: `/${encodeURIComponent(authorHandle)}/posts/${postId}`,
					query: {
						v: version + 1,
					},
				}}
			>
				{relativeCreatedAt}(수정됨)
			</Link>
		);

	return <p>{relativeCreatedAt}</p>;
}
