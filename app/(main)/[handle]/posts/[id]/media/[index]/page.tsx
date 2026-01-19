import PostCard from "@/components/posts/PostCard";
import PaginatedImages from "@/components/posts/images/PaginatedImages";
import { auth } from "@/lib/auth";
import {
	getPostWithLikesAndReplies,
	type PostWithOriginalResult,
} from "@/lib/services/post";

export default async function PostMediaPage({
	params,
}: {
	params: Promise<{ id: number; handle: string; index: number }>;
}) {
	let post: PostWithOriginalResult | null;

	const session = await auth();
	const { id, handle, index } = await params;
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

	const images = post.original ? post.original.images : post.images;

	if (index < 0 || index >= images.length)
		return <h1>해당 하는 것을 찾을 수 없음.</h1>;

	return (
		<div className="fixed top-0 left-0 bg-white w-screen h-screen flex">
			<PaginatedImages
				url={`/${handle}/posts/${id}/media`}
				index={Number(index)}
				images={images}
			/>
			<PostCard post={post} />
		</div>
	);
}
