import UserProfile from "../users/UserProfile";
import Username from "../users/Username";
import PostButtons from "./PostButtons";
import PostContent from "./PostContent";
import PostMenuButton from "./PostMenuButton";
import ReplyTo from "./ReplyTo";
import RepostedBy from "./RepostedBy";
import PostImageList from "./images/PostImageList";
import { type PostWithOriginalResult } from "@/lib/services/post";
import Link from "next/link";

export default function PostCard({
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
		images,
		isEdited,
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
		images = original.images;
		isEdited = original.isEdited;
	}

	const authorHref = `/${encodeURIComponent(original ? repostedBy.handle : author.handle)}`;

	return (
		<div className="w-full">
			{original ? (
				<div className="relative z-10 ml-7 w-fit">
					<RepostedBy
						name={repostedBy.name}
						handle={repostedBy.handle}
					/>
				</div>
			) : null}
			<div className="flex gap-x-2 w-full">
				<Link
					href={authorHref}
					className="relative z-10 hover:brightness-80 duration-200 shrink-0 h-fit"
				>
					<UserProfile profile={author.profile} size={40} />
				</Link>
				<div className="w-full">
					<div className="flex justify-between w-full">
						<Link
							href={authorHref}
							className="relative z-10 hover:underline w-fit"
						>
							<Username
								name={author.name}
								handle={author.handle}
								isProtected={author.protected}
							/>
						</Link>
						<div className="relative z-20 w-fit">
							<PostMenuButton
								postId={id}
								postContent={content}
								author={author}
							/>
						</div>
					</div>
					{parentAuthor ? (
						<div className="relative z-10 w-fit">
							<ReplyTo reply={parentAuthor} />
						</div>
					) : null}
					<div className="relative z-10 w-fit">
						<PostContent content={content} />
					</div>
					<div className="relative z-10 w-fit">
						<PostImageList
							handle={author.handle}
							postId={id}
							images={images}
						/>
					</div>
				</div>
			</div>
			<div className="relative z-10">
				<PostButtons
					postId={id}
					authorId={author.id}
					replies={replyCount}
					likes={likeCount}
					liked={isLiked}
					reposts={repostCount}
					reposted={isReposted}
					createdAt={createdAt}
					isEdited={isEdited}
					authorHandle={author.handle}
				/>
			</div>
		</div>
	);
}
