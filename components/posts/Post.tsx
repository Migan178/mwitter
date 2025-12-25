import Username from "../users/Username";
import LikeButton from "./LikeButton";
import PostContent from "./PostContent";
import PostCreatedAt from "./PostCreatedAt";
import ReplyButton from "./ReplyButton";
import { type PostDataProps } from "./types/postDataProps";
import "dayjs/locale/ko";
import Link from "next/link";

export interface PostDataWithReplyCountProps extends PostDataProps {
	replies: number;
}

export default function Post({
	user,
	handle,
	content,
	createdAt,
	id,
	likes,
	liked,
	replies,
}: PostDataWithReplyCountProps) {
	return (
		<div>
			<div>
				<Link href={`/${handle}`}>
					<Username name={user} handle={handle} />
				</Link>
			</div>
			<div>
				<Link href={`/${handle}/posts/${id}`}>
					<PostContent content={content} />
				</Link>
			</div>
			<div>
				<PostCreatedAt createdAt={createdAt} />
			</div>
			<div>
				<ReplyButton postId={id} replies={replies} />
				<LikeButton
					postId={id}
					initialLiked={liked}
					initialLikes={likes}
				/>
			</div>
		</div>
	);
}
