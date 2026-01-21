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
	isEdited: boolean;
}

export interface PostWithOriginalResult extends PostResult {
	original?: PostResult;
}

export function getQueryWithLikesAndReplyCount(userId: number) {
	return {
		id: true,
		content: true,
		createdAt: true,
		updatedAt: true,
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
		// 어차피 createdAt이랑 updatedAt이랑 게시글이 수정 되지 않았다면 같음
		createdAt: data.updatedAt,
		isEdited: data.createdAt < data.updatedAt,
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
			deleteAt: null,
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
			deleteAt: null,
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
			deleteAt: null,
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
			deleteAt: null,
		},
	});

	return refineMultiplePosts(posts);
}

export async function getPreviousPostByIdAndIndex(
	id: number,
	userId: number,
	idx: number,
): Promise<PostWithOriginalResult | null> {
	const postData = await prisma.post.findUnique({
		where: {
			id,
			deleteAt: null,
		},
		select: {
			...getQueryWithLikesAndReplyCount(userId),
			replies: {
				select: { ...getQueryWithLikesAndReplyCount(userId) },
			},
			history: {
				skip: idx - 1,
				take: 1,
				select: {
					content: true,
					createdAt: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});

	if (!postData) return null;

	const { history, replies, ...post } = postData;

	post.content = history[0].content;
	post.createdAt = history[0].createdAt;

	return {
		...refineSinglePost(post),
		replies: refineMultiplePosts(replies),
	};
}
