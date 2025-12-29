import prisma from "../prisma";

export interface PostResult {
	id: number;
	content: string;
	author: {
		id: number;
		name: string;
		handle: string;
	};
	isLiked: boolean;
	likeCount: number;
	replyCount: number;
	repostCount: number;
	isReposted: boolean;
	replies?: PostResult[];
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
		_count: {
			select: {
				likes: true,
				replies: true,
				reposts: true,
			},
		},
	};
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
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return posts.map(post => ({
		id: post.id,
		content: post.content,
		author: post.author,
		isLiked: post.likes.length > 0,
		isReposted: post.reposts.length > 0,
		likeCount: post._count.likes,
		replyCount: post._count.replies,
		repostCount: post._count.reposts,
		original: post.original
			? {
					id: post.original.id,
					content: post.original.content,
					author: post.original.author,
					isLiked: post.original.likes.length > 0,
					isReposted: post.original.reposts.length > 0,
					likeCount: post.original._count.likes,
					replyCount: post.original._count.replies,
					repostCount: post.original._count.reposts,
					createdAt: post.original.createdAt,
				}
			: undefined,
		createdAt: post.createdAt,
	}));
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
					replies: {
						select: { ...getQueryWithLikesAndReplyCount(userId) },
					},
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

	return posts.map(post => ({
		id: post.id,
		content: post.content,
		author: post.author,
		isLiked: post.likes.length > 0,
		isReposted: post.reposts.length > 0,
		likeCount: post._count.likes,
		replyCount: post._count.replies,
		repostCount: post._count.reposts,
		original: post.original
			? {
					id: post.original.id,
					content: post.original.content,
					author: post.original.author,
					isLiked: post.original.likes.length > 0,
					isReposted: post.original.reposts.length > 0,
					likeCount: post.original._count.likes,
					replyCount: post.original._count.replies,
					repostCount: post.original._count.reposts,
					createdAt: post.original.createdAt,
				}
			: undefined,
		createdAt: post.createdAt,
	}));
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
		},
	});

	if (!post) return null;

	return {
		id,
		content: post.content,
		author: post.author,
		isLiked: post.likes.length > 0,
		isReposted: post.reposts.length > 0,
		likeCount: post._count.likes,
		replyCount: post._count.replies,
		repostCount: post._count.reposts,
		parentAuthor: post.parent?.author.handle,
		original: post.original
			? {
					id: post.original.id,
					content: post.original.content,
					author: post.original.author,
					isLiked: post.original.likes.length > 0,
					isReposted: post.original.reposts.length > 0,
					likeCount: post.original._count.likes,
					replies: post.original.replies.map(post => ({
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
					replyCount: post.original._count.replies,
					repostCount: post.original._count.reposts,
					parentAuthor: post.original.parent?.author.handle,
					createdAt: post.original.createdAt,
				}
			: undefined,
		replies: post.replies.map(post => ({
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
		createdAt: post.createdAt,
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

	return posts.map(post => ({
		id: post.id,
		content: post.content,
		author: post.author,
		isLiked: post.likes.length > 0,
		isReposted: post.reposts.length > 0,
		likeCount: post._count.likes,
		replyCount: post._count.replies,
		repostCount: post._count.reposts,
		createdAt: post.createdAt,
	}));
}
