import CreatePost from "@/components/posts/CreatePost";
import List from "@/components/posts/List";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth();

	if (session)
		return (
			<div>
				<CreatePost />
				<List userId={session.user?.id!} />
			</div>
		);

	return <h1>Hello, World!</h1>;
}
