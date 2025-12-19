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

export async function getUsersWithFollowing(handle: string, sessionId: number) {
	const user = await prisma.user.findUnique({
		select: {
			following: {
				select: {
					following: {
						select: {
							id: true,
							handle: true,
							name: true,
							follower: {
								select: {
									followerId: true,
								},
								where: {
									followerId: sessionId,
								},
							},
						},
					},
				},
			},
		},
		where: {
			handle,
		},
	});

	if (!user) return [];

	return user.following.map(({ following }) => ({
		handle: following.handle,
		id: following.id,
		name: following.name,
		isFollowing: following.follower.length > 0,
	}));
}

export type UsersWithFollowingResult = Awaited<
	ReturnType<typeof getUsersWithFollowing>
>;

export async function getUsersWithFollowers(handle: string, sessionId: number) {
	const user = await prisma.user.findUnique({
		select: {
			follower: {
				select: {
					follower: {
						select: {
							id: true,
							handle: true,
							name: true,
							follower: {
								select: {
									followerId: true,
								},
								where: {
									followerId: sessionId,
								},
							},
						},
					},
				},
			},
		},
		where: {
			handle,
		},
	});

	if (!user) return [];

	return user.follower.map(({ follower }) => ({
		handle: follower.handle,
		id: follower.id,
		name: follower.name,
		isFollowing: follower.follower.length > 0,
	}));
}

export async function getUsersWithIsFollowingByQuery(
	query: string,
	sessionId: number,
) {
	const users = await prisma.user.findMany({
		select: {
			handle: true,
			id: true,
			name: true,
			follower: {
				select: {
					followerId: true,
				},
				where: {
					followerId: sessionId,
				},
			},
		},
		where: {
			OR: [
				{
					name: {
						contains: query,
					},
				},
				{
					handle: {
						contains: query,
					},
				},
			],
		},
	});

	return users.map(({ handle, id, name, follower }) => ({
		handle,
		id,
		name,
		isFollowing: follower.length > 0,
	}));
}
