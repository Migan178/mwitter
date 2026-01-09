import UserProfile from "../users/UserProfile";
import Username from "../users/Username";
import PostButtons from "./PostButtons";
import PostContent from "./PostContent";
import PostCreateBox from "./PostCreateBox";
import PostList from "./PostList";
import ReplyTo from "./ReplyTo";
import RepostedBy from "./RepostedBy";
import PostImageList from "./images/PostImageList";
import { type PostWithOriginalResult } from "@/lib/services/post";
import Link from "next/link";

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
		images,
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
		images = original.images;
	}

	return (
		<div>
			<div className="border border-gray-300 w-140">
				<div className="p-2">
					{original ? (
						<div>
							<RepostedBy
								name={repostedBy.name}
								handle={repostedBy.handle}
							/>
						</div>
					) : null}
					<div className="flex gap-x-2">
						<div className="hover:brightness-80 duration-200 w-10 h-10">
							<Link href={`/${author.handle}`}>
								<UserProfile
									profile={author.profile}
									size={40}
								/>
							</Link>
						</div>
						<div>
							<Link
								href={`/${author.handle}`}
								className="hover:underline"
							>
								<Username
									name={author.name}
									handle={author.handle}
								/>
							</Link>
							{parentAuthor ? (
								<div>
									<ReplyTo reply={parentAuthor} />
								</div>
							) : null}
							<PostContent content={content} />
						</div>
					</div>
					<div className="ml-12">
						<PostImageList
							handle={author.handle}
							postId={id}
							images={images}
						/>
					</div>
					<PostButtons
						postId={id}
						authorId={author.id}
						replies={replyCount}
						likes={likeCount}
						liked={isLiked}
						reposts={repostCount}
						reposted={isReposted}
						createdAt={createdAt}
					/>
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
