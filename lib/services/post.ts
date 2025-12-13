import prisma, { Prisma } from "../prisma";

export async function getPostsWithLikes(userId: number) {
	// TODO: Show post following people's.
	const posts = await prisma.post.findMany({
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			content: true,
			createdAt: true,
			author: {
				select: {
					name: true,
				},
			},
			likes: {
				select: {
					likerId: true,
				},
				where: {
					likerId: Number(userId),
				},
			},
			_count: {
				select: {
					likes: true,
				},
			},
		},
	});

	return posts.map(({ id, content, createdAt, _count, likes, author }) => {
		return {
			id,
			content,
			authorName: author.name,
			isLiked: likes.length > 0,
			likes: _count.likes,
			createdAt,
		};
	});
}

export type PostsWithLikesResult = Awaited<
	ReturnType<typeof getPostsWithLikes>
>;
