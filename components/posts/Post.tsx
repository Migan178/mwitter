import Username from "../users/Username";
import LikeButton from "./LikeButton";
import PostContent from "./PostContent";
import PostCreatedAt from "./PostCreatedAt";
import ReplyButton from "./ReplyButton";
import ReplyTo from "./ReplyTo";
import RepostButton from "./RepostButton";
import RepostedBy from "./RepostedBy";
import { type PostWithOriginalResult } from "@/lib/services/post";
import "dayjs/locale/ko";
import Link from "next/link";

export default function Post({
	post: {
		author,
		content,
		createdAt,
		id,
		isLiked,
		isReposted,
		likeCount,
		replyCount,
		repostCount,
		parentAuthor,
		original,
	},
}: {
	post: PostWithOriginalResult;
}) {
	let repostId = 0;
	let repostedBy = {
		name: "",
		id: 0,
		handle: "",
	};

	if (original) {
		repostId = id;
		repostedBy = author;
		author = original.author;
		content = original.content;
		createdAt = original.createdAt;
		id = original.id;
		likeCount = original.likeCount;
		isLiked = original.isLiked;
		isReposted = original.isReposted;
		replyCount = original.replyCount;
		repostCount = original.repostCount;
		parentAuthor = original.parentAuthor;
	}

	return (
		<div>
			{original ? (
				<div>
					<RepostedBy
						name={repostedBy.name}
						handle={repostedBy.handle}
					/>
				</div>
			) : null}
			{parentAuthor ? (
				<div>
					<ReplyTo reply={parentAuthor} />
				</div>
			) : null}
			<div>
				<Link href={`/${author.handle}`}>
					<Username name={author.name} handle={author.handle} />
				</Link>
			</div>
			<div>
				<Link
					href={`/${original ? repostedBy.handle : author.handle}/posts/${original ? repostId : id}`}
				>
					<PostContent content={content} />
				</Link>
			</div>
			<div>
				<PostCreatedAt createdAt={createdAt} />
			</div>
			<div>
				<ReplyButton postId={id} replies={replyCount} />
				<LikeButton
					authorId={author.id}
					postId={id}
					initialLiked={isLiked}
					initialLikes={likeCount}
				/>
				<RepostButton
					authorId={author.id}
					postId={id}
					initialReposted={isReposted}
					initialReposts={repostCount}
				/>
			</div>
		</div>
	);
}
