import prisma from "../prisma";
import { getQueryWithLikesAndReplyCount, PostResult } from "./post";

export interface UserResult {
	id: number;
	name: string;
	handle: string;
	description: string | null;
	posts?: PostResult[];
	followerCount?: number;
	followingCount?: number;
	postCount?: number;
	isFollowing: boolean;
}

export type UserWithoutFollowingResult = Omit<UserResult, "isFollowing">;

export async function getUserByHandleWithCountsAndPosts(
	handle: string,
	sessionUserId: number,
): Promise<UserResult | null> {
	const user = await prisma.user.findUnique({
		select: {
			id: true,
			name: true,
			handle: true,
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
					posts: true,
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
		handle: user.handle,
		description: user.description,
		posts: user.posts.map(post => ({
			id: post.id,
			content: post.content,
			author: post.author,
			isLiked: post.likes.length > 0,
			isReposted: post.reposts.length > 0,
			likeCount: post._count.likes,
			replyCount: post._count.replies,
			repostCount: post._count.reposts,
			createdAt: post.createdAt,
		})),
		followerCount: user._count.follower,
		followingCount: user._count.following,
		postCount: user._count.posts,
		isFollowing: user.follower.length > 0,
	};
}

export async function getUsersWithFollowing(
	handle: string,
	sessionId: number,
): Promise<UserResult[]> {
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
		id: following.id,
		name: following.name,
		handle: following.handle,
		description: following.description,
		isFollowing: following.follower.length > 0,
	}));
}

export async function getUsersWithFollowers(
	handle: string,
	sessionId: number,
): Promise<UserResult[]> {
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
		id: follower.id,
		name: follower.name,
		handle: follower.handle,
		description: follower.description,
		isFollowing: follower.follower.length > 0,
	}));
}

export async function getUsersWithIsFollowingByQuery(
	query: string,
	sessionId: number,
): Promise<UserResult[]> {
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

export async function getUserById(
	id: number,
): Promise<UserWithoutFollowingResult> {
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

	return user!;
}
