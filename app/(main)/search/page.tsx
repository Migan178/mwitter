import RecentSearchList from "@/components/search/RecentSearchList";
import SearchBox from "@/components/search/SearchBox";
import SearchWrapper from "@/components/search/SearchWrapper";
import SwitchSearchTabButton from "@/components/search/SwitchSearchTabButton";
import { auth } from "@/lib/auth";
import { getPostsWithLikesAndReplyCountByQuery } from "@/lib/services/post";
import { getUsersWithIsFollowingByQuery } from "@/lib/services/user";

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	const session = await auth();
	if (!session) return <h1>로그인 필요</h1>;

	const userId = Number(session.user?.id);
	const { q: query } = await searchParams;

	if (!query)
		return (
			<div className="w-140">
				<SearchBox />
				<RecentSearchList />
			</div>
		);

	const [posts, users] = await Promise.all([
		getPostsWithLikesAndReplyCountByQuery(query, userId).catch(() => []),
		getUsersWithIsFollowingByQuery(query, userId).catch(() => []),
	]);

	return (
		<div className="w-140">
			<SearchBox defaultValue={query} />
			<div className="border-x border-gray-300">
				<SwitchSearchTabButton />
			</div>
			<SearchWrapper posts={posts} users={users} />
		</div>
	);
}
