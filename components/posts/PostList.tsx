import Separator from "../Separator";
import Post from "./Post";
import { type PostWithOriginalResult } from "@/lib/services/post";

export default function PostList({
	posts,
}: {
	posts: PostWithOriginalResult[];
}) {
	if (!posts.length)
		return (
			<div className="gray-border p-2">
				<h1 className="ml-12">게시글 없음</h1>
			</div>
		);

	return (
		<ul className="gray-border w-full">
			{posts.map((post, i) => (
				<li key={post.id}>
					<Post post={post} />
					{i < posts.length - 1 ? <Separator /> : null}
				</li>
			))}
		</ul>
	);
}
