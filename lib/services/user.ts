import prisma from "../prisma";

export async function getUserByHandleWithCountsAndPosts(
	handle: string,
	sessionUserId: number,
) {
	const user = await prisma.user.findUnique({
		select: {
			id: true,
			name: true,
			follower: {
				select: {
					followerId: true,
				},
				where: {
					followerId: sessionUserId,
				},
			},
			_count: {
				select: {
					follower: true,
					following: true,
				},
			},
			posts: {
				select: {
					id: true,
					content: true,
					createdAt: true,
					likes: {
						select: {
							likerId: true,
						},
						where: {
							likerId: sessionUserId,
						},
					},
					_count: {
						select: {
							likes: true,
						},
					},
				},
			},
		},
		where: {
			handle,
		},
	});

	if (!user) return null;

	return {
		name: user.name,
		id: user.id,
		posts: user.posts,
		follower: user._count.follower,
		following: user._count.following,
		isFollowing: user.follower.length > 0,
	};
}

export type UserByHandleWithCountsAndPostsResult = Awaited<
	ReturnType<typeof getUserByHandleWithCountsAndPosts>
>;
