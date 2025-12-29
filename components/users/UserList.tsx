import UserListItem from "./UserListItem";
import { type UserResult } from "@/lib/services/user";

export function UserList({ users }: { users: UserResult[] }) {
	return (
		<ul>
			{users.map(user => {
				return (
					<li key={user.id}>
						<UserListItem user={user} />
					</li>
				);
			})}
		</ul>
	);
}
