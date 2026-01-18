import prisma, { Prisma } from "../prisma";
import {
	getUserQuery,
	refineSingleUser,
	type FollowStatus,
	type ProfileResult,
} from "./user";

export type PostAuthor = ProfileResult & { followStatus: FollowStatus };

export interface PostResult {
	id: number;
	content: string;
	author: PostAuthor;
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
				...getUserQuery(userId),
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postQuery = { select: getQueryWithLikesAndReplyCount(0) };
type UnrefinedPost = Prisma.PostGetPayload<typeof postQuery>;
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

export function refineSinglePost(data: UnrefinedPost): PostResult {
	return {
		id: data.id,
		content: data.content,
		author: refineSingleUser(data.author),
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
