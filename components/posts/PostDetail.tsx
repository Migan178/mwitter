import Username from "../users/Username";
import LikeButton from "./LikeButton";
import PostContent from "./PostContent";
import PostCreateBox from "./PostCreateBox";
import PostCreatedAt from "./PostCreatedAt";
import PostList from "./PostList";
import ReplyButton from "./ReplyButton";
import ReplyTo from "./ReplyTo";
import { type PostDataProps } from "./types/postDataProps";
import { type PostsWithLikesAndReplyCountResult } from "@/lib/services/post";

export interface PostDataWithRepliesProps extends PostDataProps {
	replies: PostsWithLikesAndReplyCountResult;
	replyCount: number;
}

export default function PostDetail({
	user,
	authorId,
	handle,
	content,
	createdAt,
	id,
	likes,
	liked,
	replies,
	replyCount,
	reply,
}: PostDataWithRepliesProps) {
	return (
		<div>
			{reply ? (
				<div>
					<ReplyTo reply={reply} />
				</div>
			) : null}
			<div>
				<Username name={user} handle={handle} />
			</div>
			<div>
				<PostContent content={content} />
			</div>
			<div>
				<PostCreatedAt createdAt={createdAt} />
			</div>
			<div>
				<ReplyButton postId={id} replies={replyCount} />
				<LikeButton
					authorId={authorId}
					postId={id}
					initialLiked={liked}
					initialLikes={likes}
				/>
			</div>
			<div>
				<PostCreateBox parentId={id} />
			</div>
			<div>
				<PostList posts={replies} />
			</div>
		</div>
	);
}
