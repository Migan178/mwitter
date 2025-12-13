import CreatePost from "@/components/posts/CreatePost";
import PostList from "@/components/posts/PostList";
import { auth } from "@/lib/auth";
import {
	getPostsWithLikes,
	type PostsWithLikesResult,
} from "@/lib/services/post";

export default async function Home() {
	const session = await auth();
	let posts: PostsWithLikesResult;
	try {
		posts = await getPostsWithLikes(Number(session?.user?.id));
	} catch (err) {
		console.log(err);
		return <h1>게시글 로드 중 문제 발생.</h1>;
	}

	if (session)
		return (
			<div>
				<CreatePost />
				<PostList posts={posts} />
			</div>
		);

	return <h1>Hello, World!</h1>;
}
