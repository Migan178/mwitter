import { getPostsWithLikes } from "@/lib/services/post";
import Post from "./Post";

export default async function List({ userId }: { userId: string }) {
	try {
		// TODO: Show post following people's.
		const posts = await getPostsWithLikes(Number(userId));

		return (
			<ul>
				{posts.map(post => {
					return (
						<Post
							user={post.author.name}
							content={post.content}
							createdAt={post.createdAt}
							id={post.id}
							likes={post._count.likes}
							liked={post.likes.length > 0}
						/>
					);
				})}
			</ul>
		);
	} catch (err) {
		return (
			<div>
				<h1>게시글 로드 중 문제 발생.</h1>
			</div>
		);
	}
}
