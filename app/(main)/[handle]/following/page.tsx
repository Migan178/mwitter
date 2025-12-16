import { UserList } from "@/components/users/UserList";
import { auth } from "@/lib/auth";
import { getUsersWithFollowing } from "@/lib/services/user";

export default async function FollowingPage({
	params,
}: {
	params: Promise<{ handle: string }>;
}) {
	const { handle } = await params;
	const session = await auth();
	const users = await getUsersWithFollowing(
		handle,
		session ? Number(session.user?.id) : 0,
	);

	if (!users.length)
		return (
			<div>
				<h1>해당 유저는 아무도 팔로우 하지 않음.</h1>
			</div>
		);

	return <UserList users={users} />;
}
