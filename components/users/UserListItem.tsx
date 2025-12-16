import Link from "next/link";
import Username from "./Username";
import FollowButton from "./FollowButton";

export default function UserListItem({
	handle,
	name,
	id,
	isFollowing,
}: {
	handle: string;
	name: string;
	id: number;
	isFollowing: boolean;
}) {
	return (
		<div>
			<Link href={`/${handle}`}>
				<Username name={name} handle={handle} />
			</Link>
			<FollowButton userId={id} initialIsFollowing={isFollowing} />
		</div>
	);
}
