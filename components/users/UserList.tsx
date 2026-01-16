import Separator from "../Separator";
import UserListItem from "./UserListItem";
import { type UserResult } from "@/lib/services/user";

export function UserList({ users }: { users: UserResult[] }) {
	return (
		<ul className="gray-border w-140">
			{users.map((user, i) => (
				<li key={user.id}>
					<UserListItem user={user} />
					{i < users.length - 1 ? <Separator /> : null}
				</li>
			))}
		</ul>
	);
}
