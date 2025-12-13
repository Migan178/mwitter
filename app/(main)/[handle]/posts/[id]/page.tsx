import Post from "@/components/posts/Post";
import { auth } from "@/lib/auth";
import {
	getPostWithLikes,
	type PostWithLikesResult,
} from "@/lib/services/post";

export default async function PostPage({
	params,
}: {
	params: Promise<{ id: number; handle: string }>;
}) {
	const session = await auth();
	const { id, handle } = await params;
	let post: PostWithLikesResult;

	try {
		post = await getPostWithLikes(
			Number(id),
			session ? Number(session.user?.id) : 0,
		);
	} catch (err) {
		console.log(err);
		return <h1>게시글 로드 중 문제 발생.</h1>;
	}

	if (!post || post.handle !== handle)
		return <h1>해당 게시글을 찾을 수 없음.</h1>;

	return (
		<Post
			user={post.authorName}
			handle={post.handle}
			content={post.content}
			createdAt={post.createdAt}
			id={post.id}
			likes={post.likes}
			liked={post.isLiked}
		/>
	);
}
