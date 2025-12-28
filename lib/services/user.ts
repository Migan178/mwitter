import prisma from "../prisma";
import { getQueryWithLikesAndReplyCount } from "./post";

export async function getUserByHandleWithCountsAndPosts(
	handle: string,
	sessionUserId: number,
) {
	const user = await prisma.user.findUnique({
		select: {
			id: true,
			name: true,
			description: true,
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
					...getQueryWithLikesAndReplyCount(sessionUserId),
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
		description: user.description,
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
							description: true,
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
		description: following.description,
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
							description: true,
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
		description: follower.description,
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
			description: true,
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

	return users.map(({ handle, id, name, follower, description }) => ({
		handle,
		id,
		name,
		description,
		isFollowing: follower.length > 0,
	}));
}

export async function getUserById(id: number) {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			id: true,
			handle: true,
			name: true,
			description: true,
		},
	});

	return user;
}

export type UserResult = Awaited<ReturnType<typeof getUserById>>;
