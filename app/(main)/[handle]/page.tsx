import PostList from "@/components/posts/PostList";
import FollowButton from "@/components/users/FollowButton";
import UserInfo from "@/components/users/UserInfo";
import { auth } from "@/lib/auth";
import { PostsWithLikesResult } from "@/lib/services/post";
import {
	getUserByHandleWithCountsAndPosts,
	type UserByHandleWithCountsAndPostsResult,
} from "@/lib/services/user";

export default async function User({
	params,
}: {
	params: Promise<{ handle: string }>;
}) {
	const { handle } = await params;
	const session = await auth();
	let user: UserByHandleWithCountsAndPostsResult;

	try {
		user = await getUserByHandleWithCountsAndPosts(
			handle,
			Number(session?.user?.id),
		);
	} catch (err) {
		console.log(err);
		return <h1>해당 유저를 찾는데 문제가 발생 했음.</h1>;
	}

	if (!user) return <h1>해당 하는 유저를 찾을 수 없음.</h1>;

	const posts: PostsWithLikesResult = user.posts.map(
		({ id, content, likes, createdAt, _count }) => {
			return {
				id,
				content,
				handle,
				authorName: user.name,
				likes: _count.likes,
				createdAt,
				isLiked: likes.length > 0,
			};
		},
	);

	return (
		<div className="flex">
			<div>
				<UserInfo
					name={user.name}
					handle={handle}
					followers={user.follower}
					following={user.following.length}
					posts={user.posts.length}
				/>
				<FollowButton
					userId={user.id}
					initialIsFollowing={
						session
							? user.following.includes(Number(session.user?.id))
							: false
					}
				/>
			</div>
			<PostList posts={posts} />
		</div>
	);
}
