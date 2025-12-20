import Post from "./Post";
import { PostsWithLikesResult } from "@/lib/services/post";

export default function PostList({ posts }: { posts: PostsWithLikesResult }) {
	return (
		<ul>
			{posts.map(post => {
				return (
					<li key={post.id}>
						<Post
							user={post.authorName}
							handle={post.handle}
							content={post.content}
							createdAt={post.createdAt}
							id={post.id}
							likes={post.likes}
							liked={post.isLiked}
						/>
					</li>
				);
			})}
		</ul>
	);
}
