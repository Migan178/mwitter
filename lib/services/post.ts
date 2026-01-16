import prisma from "../prisma";
import { type ProfileResult } from "./user";

export interface PostResult {
	id: number;
	content: string;
	author: ProfileResult & { isFollowing: boolean };
	isLiked: boolean;
	likeCount: number;
	replyCount: number;
	repostCount: number;
	isReposted: boolean;
	replies?: PostResult[];
	images: {
		order: number;
		url: string;
	}[];
	parentAuthor?: string;
	createdAt: Date;
}

export interface PostWithOriginalResult extends PostResult {
	original?: PostResult;
}

export function getQueryWithLikesAndReplyCount(userId: number) {
	return {
		id: true,
		content: true,
		createdAt: true,
		author: {
			select: {
				id: true,
				name: true,
				handle: true,
				profile: true,
				protected: true,
				follower: {
					select: {
						followerId: true,
					},
					where: {
						followerId: userId,
					},
				},
			},
		},
		parent: {
			select: {
				author: {
					select: {
						handle: true,
					},
				},
			},
		},
		likes: {
			select: {
				likerId: true,
			},
			where: {
				likerId: userId,
			},
		},
		reposts: {
			select: {
				authorId: true,
			},
			where: {
				authorId: userId,
			},
		},
		images: {
			select: {
				name: true,
				url: true,
				order: true,
			},
		},
		_count: {
			select: {
				likes: true,
				replies: true,
				reposts: true,
			},
		},
	};
}

type UnrefinedPost = Awaited<ReturnType<typeof getUnrefinedPost>>[number];
type UnrefinedPostWithOriginal = UnrefinedPost & {
	original: UnrefinedPost | null;
};

export function getWhereQueryWithProtected(userId: number) {
	return [
		{
			protected: false,
		},
		{
			follower: {
				some: {
					followerId: userId,
				},
			},
		},
		{
			id: userId,
		},
	];
}

/** @description 이 함수는 타입을 위해 있음. 절대 사용 금지. */
async function getUnrefinedPost() {
	return await prisma.post.findMany({
		select: {
			...getQueryWithLikesAndReplyCount(0),
		},
	});
}

export function refineSinglePost(data: UnrefinedPost): PostResult {
	return {
		id: data.id,
		content: data.content,
		author: {
			id: data.author.id,
			name: data.author.name,
			handle: data.author.handle,
			profile: data.author.profile,
			protected: data.author.protected,
			isFollowing: !!data.author.follower.length,
		},
		isLiked: data.likes.length > 0,
		isReposted: data.reposts.length > 0,
		likeCount: data._count.likes,
		replyCount: data._count.replies,
		repostCount: data._count.reposts,
		images: data.images.map(image => ({
			order: image.order,
			url: image.url,
		})),
		createdAt: data.createdAt,
	};
}

export function refineSinglePostWithOriginal(
	data: UnrefinedPostWithOriginal,
): PostWithOriginalResult {
	const { original, ...post } = data;

	return {
		...refineSinglePost(post),
		original: original ? refineSinglePost(original) : undefined,
	};
}

export function refineMultiplePosts(data: UnrefinedPost[]): PostResult[] {
	return data.map(data => refineSinglePost(data));
}

export function refineMultiplePostsWithOriginal(
	data: UnrefinedPostWithOriginal[],
): PostWithOriginalResult[] {
	return data.map(data => refineSinglePostWithOriginal(data));
}

export async function getAllPostsWithLikesAndReplyCount(
	userId: number,
): Promise<PostWithOriginalResult[]> {
	const posts = await prisma.post.findMany({
		select: {
			...getQueryWithLikesAndReplyCount(userId),
			original: {
				select: {
					...getQueryWithLikesAndReplyCount(userId),
				},
			},
		},
		where: {
			parentId: null,
			author: {
				OR: [...getWhereQueryWithProtected(userId)],
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return refineMultiplePostsWithOriginal(posts);
}

export async function getFollowingPostsWithLikesReplyCount(
	userId: number,
): Promise<PostWithOriginalResult[]> {
	const posts = await prisma.post.findMany({
		select: {
			...getQueryWithLikesAndReplyCount(userId),
			original: {
				select: {
					...getQueryWithLikesAndReplyCount(userId),
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		where: {
			author: {
				follower: {
					some: {
						follower: {
							id: userId,
						},
					},
				},
			},
		},
	});

	return refineMultiplePostsWithOriginal(posts);
}

export async function getPostWithLikesAndReplies(
	id: number,
	userId: number,
): Promise<PostWithOriginalResult | null> {
	const post = await prisma.post.findUnique({
		select: {
			...getQueryWithLikesAndReplyCount(userId),
			original: {
				select: {
					...getQueryWithLikesAndReplyCount(userId),
					replies: {
						select: { ...getQueryWithLikesAndReplyCount(userId) },
					},
				},
			},
			replies: {
				select: {
					...getQueryWithLikesAndReplyCount(userId),
				},
			},
		},
		where: {
			id,
			author: {
				OR: [...getWhereQueryWithProtected(userId)],
			},
		},
	});

	if (!post) return null;

	const { replies, ...postWithoutReplies } = post;

	return {
		...refineSinglePostWithOriginal(postWithoutReplies),
		replies: refineMultiplePosts(
			postWithoutReplies.original
				? postWithoutReplies.original.replies
				: replies,
		),
	};
}

export async function getPostsWithLikesAndReplyCountByQuery(
	query: string,
	userId: number,
): Promise<PostResult[]> {
	const posts = await prisma.post.findMany({
		select: {
			...getQueryWithLikesAndReplyCount(userId),
		},
		where: {
			parentId: null,
			originalId: null,
			content: {
				contains: query,
			},
		},
	});

	return refineMultiplePosts(posts);
}
