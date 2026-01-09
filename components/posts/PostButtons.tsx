import LikeButton from "./LikeButton";
import PostCreatedAt from "./PostCreatedAt";
import ReplyButton from "./ReplyButton";
import RepostButton from "./RepostButton";

export default function PostButtons({
	postId,
	authorId,
	replies,
	likes,
	liked,
	reposts,
	reposted,
	createdAt,
}: {
	postId: number;
	authorId: number;
	replies: number;
	likes: number;
	liked: boolean;
	reposts: number;
	reposted: boolean;
	createdAt: Date;
}) {
	return (
		<div className="flex justify-between ml-12 mt-2 gap-x-3">
			<ReplyButton postId={postId} replies={replies} />
			<LikeButton
				authorId={authorId}
				postId={postId}
				initialLiked={liked}
				initialLikes={likes}
			/>
			<RepostButton
				authorId={authorId}
				postId={postId}
				initialReposted={reposted}
				initialReposts={reposts}
			/>
			<div className="text-gray-500">
				<PostCreatedAt createdAt={createdAt} />
			</div>
		</div>
	);
}
