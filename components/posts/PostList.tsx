import Post from "./Post";
import { type PostWithOriginalResult } from "@/lib/services/post";

export default function PostList({
	posts,
}: {
	posts: PostWithOriginalResult[];
}) {
	return (
		<ul>
			{posts.map(post => {
				return (
					<li key={post.id}>
						<Post post={post} />
					</li>
				);
			})}
		</ul>
	);
}
