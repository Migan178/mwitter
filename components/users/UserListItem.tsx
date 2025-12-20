import FollowButton from "./FollowButton";
import Username from "./Username";
import Link from "next/link";

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
