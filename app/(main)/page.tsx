import CreatePost from "@/components/posts/CreatePost";
import List from "@/components/posts/List";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function Home() {
	const session = await auth();

	if (session) {
		let posts: ({
			author: {
				name: string;
			};
		} & {
			id: number;
			createdAt: Date;
			updatedAt: Date;
			content: string;
			authorId: number;
		})[];

		try {
			// TODO: Show post following people's.
			posts = await prisma.post.findMany({
				orderBy: {
					createdAt: "desc",
				},
				include: {
					author: {
						select: {
							name: true,
						},
					},
				},
			});
		} catch (err) {
			return (
				<div>
					<CreatePost />
					<h1>게시글 로드 중 문제 발생.</h1>
				</div>
			);
		}

		return (
			<div>
				<CreatePost />
				<List posts={posts} />
			</div>
		);
	}

	return <h1>Hello, World!</h1>;
}
