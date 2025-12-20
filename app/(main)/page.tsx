import CreatePost from "@/components/posts/CreatePost";
import PostsWrapper from "@/components/posts/PostsWrapper";
import SwitchPostsTabButton from "@/components/posts/SwitchPostsTabButton";
import { auth } from "@/lib/auth";
import {
	getAllPostsWithLikes,
	getFollowingPostsWithLikes,
} from "@/lib/services/post";

/** @description It will be shown logged in */
export default async function Home() {
	const session = (await auth())!;
	const userId = Number(session.user?.id);

	const [allPosts, followingPosts] = await Promise.all([
		getAllPostsWithLikes(userId).catch(() => []),
		getFollowingPostsWithLikes(userId).catch(() => []),
	]);

	return (
		<div>
			<SwitchPostsTabButton />
			<CreatePost />
			<PostsWrapper allPosts={allPosts} followingPosts={followingPosts} />
		</div>
	);
}
