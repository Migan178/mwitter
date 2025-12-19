import prisma from "../prisma";

function getQueryWithLikes(userId: number) {
	return {
		select: {
			id: true,
			content: true,
			createdAt: true,
			author: {
				select: {
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
				},
			},
		},
	};
}

export async function getAllPostsWithLikes(userId: number) {
	const posts = await prisma.post.findMany({
		...getQueryWithLikes(userId),
		orderBy: {
			createdAt: "desc",
		},
	});

	return posts.map(({ id, content, createdAt, _count, likes, author }) => ({
		id,
		content,
		handle: author.handle,
		authorName: author.name,
		isLiked: likes.length > 0,
		likes: _count.likes,
		createdAt,
	}));
}

export async function getFollowingPostsWithLikes(userId: number) {
	const posts = await prisma.post.findMany({
		...getQueryWithLikes(userId),
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
		isLiked: likes.length > 0,
		likes: _count.likes,
		createdAt,
	}));
}

export async function getPostWithLikes(
	id: number,
	userId: number,
): Promise<PostWithLikesResult> {
	const post = await prisma.post.findUnique({
		...getQueryWithLikes(userId),
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
		isLiked: post.likes.length > 0,
		likes: post._count.likes,
		createdAt: post.createdAt,
	};
}

export async function getPostWithLikesByQuery(
	query: string,
	sessionId: number,
): Promise<PostsWithLikesResult> {
	const posts = await prisma.post.findMany({
		...getQueryWithLikes(sessionId),
		where: {
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
		isLiked: likes.length > 0,
		likes: _count.likes,
		createdAt,
	}));
}

export type PostsWithLikesResult = Awaited<
	ReturnType<typeof getAllPostsWithLikes>
>;

export type PostWithLikesResult = PostsWithLikesResult[number] | null;
