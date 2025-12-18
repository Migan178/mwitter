import { type UsersWithFollowingResult } from "@/lib/services/user";
import UserListItem from "./UserListItem";

export function UserList({ users }: { users: UsersWithFollowingResult }) {
	return (
		<ul>
			{users.map(user => {
				return (
					<li key={user.id}>
						<UserListItem
							name={user.name}
							handle={user.handle}
							id={user.id}
							isFollowing={user.isFollowing}
						/>
					</li>
				);
			})}
		</ul>
	);
}
