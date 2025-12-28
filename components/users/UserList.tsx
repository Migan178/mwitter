import UserListItem from "./UserListItem";
import { type UsersWithFollowingResult } from "@/lib/services/user";

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
							description={user.description}
							isFollowing={user.isFollowing}
						/>
					</li>
				);
			})}
		</ul>
	);
}
