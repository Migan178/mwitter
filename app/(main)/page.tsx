import CreatePost from "@/components/posts/CreatePost";
import PostList from "@/components/posts/PostList";
import PostsWrapper from "@/components/posts/PostsWrapper";
import SwitchTabButton from "@/components/posts/SwitchTabButton";
import { auth } from "@/lib/auth";
import {
	getAllPostsWithLikes,
	getFollowingPostsWithLikes,
} from "@/lib/services/post";

export default async function Home() {
	const session = await auth();
	const userId = session ? Number(session.user?.id) : 0;

	const [allPosts, followingPosts] = await Promise.all([
		getAllPostsWithLikes(userId).catch(() => []),
		getFollowingPostsWithLikes(userId).catch(() => []),
	]);

	if (session)
		return (
			<div>
				<SwitchTabButton />
				<CreatePost />
				<PostsWrapper
					allPosts={allPosts}
					followingPosts={followingPosts}
				/>
			</div>
		);

	return <h1>Hello, World!</h1>;
}
