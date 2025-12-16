import PostList from "@/components/posts/PostList";
import EditProfileButton from "@/components/users/EditProfileButton";
import FollowButton from "@/components/users/FollowButton";
import LoginToFollowButton from "@/components/users/LoginToFollowButton";
import UserInfo from "@/components/users/UserInfo";
import { auth } from "@/lib/auth";
import { type PostsWithLikesResult } from "@/lib/services/post";
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

	let showFollowButton,
		showLoginToFollowButton,
		showEditProfileButton = false;

	try {
		user = await getUserByHandleWithCountsAndPosts(
			handle,
			session ? Number(session.user?.id) : 0,
		);
	} catch (err) {
		console.log(err);
		return <h1>해당 유저를 찾는데 문제가 발생 했음.</h1>;
	}

	if (!user) return <h1>해당 하는 유저를 찾을 수 없음.</h1>;

	if (session)
		if (Number(session.user?.id) === user.id) showEditProfileButton = true;
		else showFollowButton = true;
	else showLoginToFollowButton = true;

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
					following={user.following}
					posts={user.posts.length}
				/>
				{showEditProfileButton ? <EditProfileButton /> : null}
				{showFollowButton ? (
					<FollowButton
						userId={user.id}
						initialIsFollowing={user.isFollowing}
					/>
				) : null}
				{showLoginToFollowButton ? <LoginToFollowButton /> : null}
			</div>
			<PostList posts={posts} />
		</div>
	);
}
