import PostCard from "./PostCard";
import { type PostWithOriginalResult } from "@/lib/services/post";
import "dayjs/locale/ko";
import Link from "next/link";

export default function Post({ post }: { post: PostWithOriginalResult }) {
	let repostId = 0;
	let repostedBy = {
		name: "",
		id: 0,
		handle: "",
	};
	let { author, id } = post;
	const { original } = post;

	if (original) {
		repostId = id;
		repostedBy = author;
		author = original.author;
		id = original.id;
	}

	const authorHref = `/${encodeURIComponent(original ? repostedBy.handle : author.handle)}`;
	const postHref = `${authorHref}/posts/${encodeURIComponent(original ? repostId : id)}`;

	return (
		<div className="p-2 relative w-full">
			<PostCard post={post} />
			<Link
				href={postHref}
				className="absolute w-full h-full top-0 left-0 z-1"
			/>
		</div>
	);
}
