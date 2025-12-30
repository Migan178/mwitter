import Post from "./Post";
import { type PostWithOriginalResult } from "@/lib/services/post";

export default function PostList({
	posts,
}: {
	posts: PostWithOriginalResult[];
}) {
	if (!posts.length)
		return (
			<div className="border border-gray-300 p-2">
				<h1 className="ml-12">게시글 없음</h1>
			</div>
		);

	return (
		<ul className="border border-gray-300">
			{posts.map(post => {
				return (
					<li key={post.id}>
						<Post post={post} />
						<hr className="border-gray-300" />
					</li>
				);
			})}
		</ul>
	);
}
