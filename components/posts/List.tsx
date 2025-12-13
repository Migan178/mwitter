import Post from "./Post";

export default async function List({
	posts,
}: {
	posts: ({
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
}) {
	return (
		<ul>
			{posts.map(post => {
				return (
					<Post
						user={post.author.name}
						content={post.content}
						createdAt={post.createdAt}
						id={post.id}
					/>
				);
			})}
		</ul>
	);
}
