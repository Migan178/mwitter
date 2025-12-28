import SearchBox from "@/components/search/SearchBox";
import SearchWrapper from "@/components/search/SearchWrapper";
import SwitchSearchTabButton from "@/components/search/SwitchSearchTabButton";
import { auth } from "@/lib/auth";
import { getPostsWithLikesAndReplyCountByQuery } from "@/lib/services/post";
import { getUsersWithIsFollowingByQuery } from "@/lib/services/user";

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q: string }>;
}) {
	const session = await auth();
	if (!session) return <h1>로그인 필요</h1>;

	const userId = Number(session.user?.id);
	const { q: query } = await searchParams;

	const [posts, users] = await Promise.all([
		getPostsWithLikesAndReplyCountByQuery(query, userId).catch(() => []),
		getUsersWithIsFollowingByQuery(query, userId).catch(() => []),
	]);

	return (
		<div>
			<SearchBox defaultValue={query} />
			<SwitchSearchTabButton />
			<SearchWrapper posts={posts} users={users} />
		</div>
	);
}
