import CreatePost from "@/components/posts/CreatePost";
import PostsWrapper from "@/components/posts/PostsWrapper";
import SwitchPostsTabButton from "@/components/posts/SwitchPostsTabButton";
import SearchBox from "@/components/search/SearchBox";
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
				{/* TODO: Move search box to nav bar or side bar */}
				<SearchBox />
				<SwitchPostsTabButton />
				<CreatePost />
				<PostsWrapper
					allPosts={allPosts}
					followingPosts={followingPosts}
				/>
			</div>
		);

	return <h1>Hello, World!</h1>;
}
