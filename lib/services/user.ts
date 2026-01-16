import prisma from "../prisma";
import {
	getQueryWithLikesAndReplyCount,
	type PostWithOriginalResult,
	refineMultiplePostsWithOriginal,
} from "./post";

export type FollowStatus = "NOT_FOLLOWING" | "REQUESTED" | "FOLLOWING";

export interface UserResult {
	id: number;
	name: string;
	profile: string;
	handle: string;
	description: string | null;
	posts?: PostWithOriginalResult[];
	followerCount?: number;
	followingCount?: number;
	postCount?: number;
	followStatus: FollowStatus;
	protected: boolean;
}

export type UserWithoutFollowingResult = Omit<UserResult, "followStatus">;

export interface ProfileResult {
	id: number;
	name: string;
	profile: string;
	handle: string;
	protected: boolean;
	description: string | null;
}

export type UnrefinedUser = Awaited<
	ReturnType<typeof getUnrefinedUser>
>[number];

export function getUserQuery(userId: number) {
	return {
		id: true,
		name: true,
		profile: true,
		handle: true,
		description: true,
		protected: true,
		follower: {
			select: {
				followerId: true,
			},
			where: {
				followerId: userId,
			},
		},
		followRequests: {
			select: {
				followerId: true,
			},
			where: {
				followerId: userId,
			},
		},
	};
}

const {
	follower: _,
	followRequests: __,
	...userWithoutFollowingQuery
} = getUserQuery(0);

export { userWithoutFollowingQuery };

/** @description 이 함수는 타입을 위해 있음. 절대 사용 금지. */
async function getUnrefinedUser() {
	return await prisma.user.findMany({
		select: {
			...getUserQuery(0),
		},
	});
}

export function refineSingleUser(data: UnrefinedUser): UserResult {
	let followStatus: FollowStatus;

	if (data.follower.length > 0) followStatus = "FOLLOWING";
	else if (data.followRequests.length > 0) followStatus = "REQUESTED";
	else followStatus = "NOT_FOLLOWING";

	return {
		id: data.id,
		name: data.name,
		profile: data.profile,
		handle: data.handle,
		description: data.description,
		protected: data.protected,
		followStatus,
	};
}

export function refineMultipleUsers(data: UnrefinedUser[]): UserResult[] {
	return data.map(data => refineSingleUser(data));
}

export async function getUserByHandleWithCountsAndPosts(
	handle: string,
	sessionUserId: number,
): Promise<UserResult | null> {
	const user = await prisma.user.findUnique({
		select: {
			...getUserQuery(sessionUserId),
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
					original: {
						select: {
							...getQueryWithLikesAndReplyCount(sessionUserId),
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
		where: {
			handle,
		},
	});

	if (!user) return null;

	return {
		...refineSingleUser(user),
		posts: refineMultiplePostsWithOriginal(user.posts),
		followerCount: user._count.follower,
		followingCount: user._count.following,
		postCount: user._count.posts,
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
							...getUserQuery(sessionId),
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

	return refineMultipleUsers(
		user.following.map(({ following }) => following),
	);
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
							...getUserQuery(sessionId),
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

	return refineMultipleUsers(user.follower.map(({ follower }) => follower));
}

export async function getUsersWithIsFollowingByQuery(
	searchQuery: string,
	sessionId: number,
): Promise<UserResult[]> {
	const users = await prisma.user.findMany({
		select: {
			...getUserQuery(sessionId),
		},
		where: {
			OR: [
				{
					name: {
						contains: searchQuery,
					},
				},
				{
					handle: {
						contains: searchQuery,
					},
				},
			],
		},
	});

	return refineMultipleUsers(users);
}

export async function getUserById(
	id: number,
): Promise<UserWithoutFollowingResult> {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			...userWithoutFollowingQuery,
		},
	});

	return user!;
}

export async function getProfileById(id: number): Promise<ProfileResult> {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
		select: {
			...userWithoutFollowingQuery,
		},
	});

	return user!;
}

export async function getFollowRequestsById(
	id: number,
): Promise<ProfileResult[]> {
	const users = await prisma.followRequest.findMany({
		where: {
			followingId: id,
		},
		select: {
			follower: {
				select: { ...userWithoutFollowingQuery },
			},
		},
	});

	return users.map(({ follower }) => follower);
}
