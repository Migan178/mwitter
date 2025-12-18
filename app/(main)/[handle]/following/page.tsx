import { UserList } from "@/components/users/UserList";
import { auth } from "@/lib/auth";
import {
	getUsersWithFollowing,
	type UsersWithFollowingResult,
} from "@/lib/services/user";

export default async function FollowingPage({
	params,
}: {
	params: Promise<{ handle: string }>;
}) {
	let users: UsersWithFollowingResult;

	const { handle } = await params;
	const session = await auth();

	try {
		users = await getUsersWithFollowing(
			handle,
			session ? Number(session.user?.id) : 0,
		);
	} catch (err) {
		console.log(err);
		return (
			<div>
				<h1>유저를 로드 중 오류 발생.</h1>
			</div>
		);
	}

	if (!users.length)
		return (
			<div>
				<h1>해당 유저는 아무도 팔로우 하지 않음.</h1>
			</div>
		);

	return <UserList users={users} />;
}
