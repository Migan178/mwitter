import prisma from "../prisma";

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
		likes: {
			select: {
				likerId: true,
			},
			where: {
				likerId: userId,
			},
		},
		_count: {
			select: {
				likes: true,
				replies: true,
			},
		},
	};
}

export async function getAllPostsWithLikesAndReplyCount(userId: number) {
	const posts = await prisma.post.findMany({
		select: { ...getQueryWithLikesAndReplyCount(userId) },
		where: {
			parentId: null,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return posts.map(({ id, content, createdAt, _count, likes, author }) => ({
		id,
		content,
		handle: author.handle,
		authorName: author.name,
		authorId: author.id,
		isLiked: likes.length > 0,
		likes: _count.likes,
		replies: _count.replies,
		createdAt,
	}));
}

export async function getFollowingPostsWithLikesReplyCount(userId: number) {
	const posts = await prisma.post.findMany({
		select: { ...getQueryWithLikesAndReplyCount(userId) },
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

	return posts.map(({ id, content, createdAt, _count, likes, author }) => ({
		id,
		content,
		handle: author.handle,
		authorName: author.name,
		authorId: author.id,
		isLiked: likes.length > 0,
		likes: _count.likes,
		replies: _count.replies,
		createdAt,
	}));
}

export async function getPostWithLikesAndReplies(id: number, userId: number) {
	const post = await prisma.post.findUnique({
		select: {
			...getQueryWithLikesAndReplyCount(userId),
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
		handle: post.author.handle,
		authorName: post.author.name,
		authorId: post.author.id,
		isLiked: post.likes.length > 0,
		likes: post._count.likes,
		replyCount: post._count.replies,
		replies: post.replies.map(
			({ id, content, createdAt, _count, likes, author }) => ({
				id,
				content,
				handle: author.handle,
				authorName: author.name,
				authorId: author.id,
				isLiked: likes.length > 0,
				likes: _count.likes,
				replies: _count.replies,
				createdAt,
			}),
		),
		createdAt: post.createdAt,
	};
}

export async function getPostsWithLikesAndReplyCountByQuery(
	query: string,
	sessionId: number,
): Promise<PostsWithLikesAndReplyCountResult> {
	const posts = await prisma.post.findMany({
		select: {
			...getQueryWithLikesAndReplyCount(sessionId),
		},
		where: {
			parentId: null,
			content: {
				contains: query,
			},
		},
	});

	return posts.map(({ id, content, createdAt, _count, likes, author }) => ({
		id,
		content,
		handle: author.handle,
		authorName: author.name,
		authorId: author.id,
		isLiked: likes.length > 0,
		likes: _count.likes,
		replies: _count.replies,
		createdAt,
	}));
}

export type PostsWithLikesAndReplyCountResult = Awaited<
	ReturnType<typeof getAllPostsWithLikesAndReplyCount>
>;

export type PostWithLikesAndRepliesResult = Awaited<
	ReturnType<typeof getPostWithLikesAndReplies>
>;
