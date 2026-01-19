import PostCard from "@/components/posts/PostCard";
import PostCreateBox from "@/components/posts/PostCreateBox";
import PostList from "@/components/posts/PostList";
import { auth } from "@/lib/auth";
import {
	getPostWithLikesAndReplies,
	type PostWithOriginalResult,
} from "@/lib/services/post";

export default async function PostPage({
	params,
}: {
	params: Promise<{ id: number; handle: string }>;
}) {
	let post: PostWithOriginalResult | null;

	const session = await auth();
	const { id, handle } = await params;
	const sessionId = Number(session?.user?.id || 0);

	try {
		post = await getPostWithLikesAndReplies(Number(id), sessionId);
	} catch (err) {
		console.log(err);
		return <h1>게시글 로드 중 문제 발생.</h1>;
	}

	if (!post || post.author.handle !== handle)
		return <h1>해당 게시글을 찾을 수 없음.</h1>;

	if (
		post.author.protected &&
		post.author.id !== sessionId &&
		post.author.followStatus !== "FOLLOWING"
	)
		return <h1>게시글을 볼려면 해당 유저를 팔로우</h1>;

	return (
		<div>
			<div className="gray-border w-140">
				<div className="p-2">
					<PostCard post={post} />
				</div>
			</div>
			<div className="border-x border-gray-300">
				<PostCreateBox
					parentId={post.original ? post.original.id : id}
				/>
			</div>
			<div>
				<PostList
					posts={
						post.original ? post.original.replies! : post.replies!
					}
				/>
			</div>
		</div>
	);
}
