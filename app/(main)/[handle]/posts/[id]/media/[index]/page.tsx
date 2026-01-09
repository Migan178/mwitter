import PostDetail from "@/components/posts/PostDetail";
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
	const session = await auth();
	const { id, handle, index } = await params;
	let post: PostWithOriginalResult | null;

	try {
		post = await getPostWithLikesAndReplies(
			Number(id),
			session ? Number(session.user?.id) : 0,
		);
	} catch (err) {
		console.log(err);
		return <h1>게시글 로드 중 문제 발생.</h1>;
	}

	if (!post || post.author.handle !== handle)
		return <h1>해당 게시글을 찾을 수 없음.</h1>;

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
			<PostDetail post={post} />
		</div>
	);
}
