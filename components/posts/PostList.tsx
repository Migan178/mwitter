import Post from "./Post";
import { PostsWithLikesAndReplyCountResult } from "@/lib/services/post";

export default function PostList({
	posts,
}: {
	posts: PostsWithLikesAndReplyCountResult;
}) {
	return (
		<ul>
			{posts.map(post => {
				return (
					<li key={post.id}>
						<Post
							user={post.authorName}
							authorId={post.authorId}
							handle={post.handle}
							content={post.content}
							createdAt={post.createdAt}
							id={post.id}
							likes={post.likes}
							liked={post.isLiked}
							reply={post.parentAuthor}
							replies={post.replies}
						/>
					</li>
				);
			})}
		</ul>
	);
}
