import LoginButton from "@/components/LoginButton";
import CreatePost from "@/components/posts/CreatePost";
import PostsWrapper from "@/components/posts/PostsWrapper";
import SwitchPostsTabButton from "@/components/posts/SwitchPostsTabButton";
import { auth } from "@/lib/auth";
import {
	getAllPostsWithLikes,
	getFollowingPostsWithLikes,
} from "@/lib/services/post";

export default async function Home() {
	const session = await auth();
	if (session) {
		const userId = Number(session.user?.id);

		const [allPosts, followingPosts] = await Promise.all([
			getAllPostsWithLikes(userId).catch(() => []),
			getFollowingPostsWithLikes(userId).catch(() => []),
		]);

		return (
			<div>
				<SwitchPostsTabButton />
				<CreatePost />
				<PostsWrapper
					allPosts={allPosts}
					followingPosts={followingPosts}
				/>
			</div>
		);
	}
	return (
		<div className="grid h-screen items-center justify-center">
			<div className="flex flex-col gap-y-2 text-center">
				<h1 className="text-4xl font-bold">Mwitter</h1>
				<h2 className="text-2xl font-semibold">로그인해서 시작하기</h2>
				<LoginButton />
			</div>
		</div>
	);
}
