import SearchBox from "@/components/search/SearchBox";
import SearchWrapper from "@/components/search/SearchWrapper";
import SwitchSearchTabButton from "@/components/search/SwitchSearchTabButton";
import { auth } from "@/lib/auth";
import { getPostWithLikesByQuery } from "@/lib/services/post";
import { getUsersWithIsFollowingByQuery } from "@/lib/services/user";

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q: string }>;
}) {
	const session = await auth();
	const userId = session ? Number(session.user?.id) : 0;
	const { q: query } = await searchParams;
	const posts = await getPostWithLikesByQuery(query, userId);
	const users = await getUsersWithIsFollowingByQuery(query, userId);

	return (
		<div>
			<SearchBox defaultValue={query} />
			<SwitchSearchTabButton />
			<SearchWrapper posts={posts} users={users} />
		</div>
	);
}
