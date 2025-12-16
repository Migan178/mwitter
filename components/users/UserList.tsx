import { type UsersWithFollowing } from "@/lib/services/user";
import UserListItem from "./UserListItem";

export function UserList({ users }: { users: UsersWithFollowing }) {
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
