import FollowRequestsList from "@/components/profiles/FollowRequestsList";
import { auth } from "@/lib/auth";
import { getFollowRequestsById, type ProfileResult } from "@/lib/services/user";

export default async function FollowRequestsPage() {
	let users: ProfileResult[];

	const session = await auth();
	if (!session || !session.user) return <h1>접근 권한 없음.</h1>;

	const userId = Number(session.user.id);

	try {
		users = await getFollowRequestsById(userId);
	} catch (err) {
		console.error(err);
		return <h1>목록을 불러오던 중 오류 발생.</h1>;
	}

	return <FollowRequestsList users={users} />;
}
