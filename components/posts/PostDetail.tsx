import UserProfile from "../users/UserProfile";
import Username from "../users/Username";
import LikeButton from "./LikeButton";
import PostContent from "./PostContent";
import PostCreateBox from "./PostCreateBox";
import PostCreatedAt from "./PostCreatedAt";
import PostList from "./PostList";
import ReplyButton from "./ReplyButton";
import ReplyTo from "./ReplyTo";
import RepostButton from "./RepostButton";
import RepostedBy from "./RepostedBy";
import { type PostWithOriginalResult } from "@/lib/services/post";

export default function PostDetail({
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
		replies,
	},
}: {
	post: PostWithOriginalResult;
}) {
	let repostedBy = {
		name: "",
		id: 0,
		handle: "",
	};

	if (original) {
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
		replies = original.replies;
	}

	return (
		<div>
			<div className="border border-gray-300">
				<div className="p-2">
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
					<div className="flex gap-x-2">
						<div>
							<UserProfile profile={author.profile} size={40} />
						</div>
						<div>
							<Username
								name={author.name}
								handle={author.handle}
							/>
							<PostContent content={content} />
						</div>
					</div>
					<div className="flex justify-between ml-12 mt-2 gap-x-3">
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
						<PostCreatedAt createdAt={createdAt} />
					</div>
				</div>
			</div>
			<div className="border-x border-gray-300">
				<PostCreateBox parentId={id} />
			</div>
			<div>
				<PostList posts={replies!} />
			</div>
		</div>
	);
}
