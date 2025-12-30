import Description from "./Description";
import UserProfile from "./UserProfile";
import Username from "./Username";
import { UserResult } from "@/lib/services/user";
import Link from "next/link";

export default function UserInfo({
	user: {
		name,
		handle,
		followerCount,
		followingCount,
		description,
		postCount,
		profile,
	},
}: {
	user: UserResult;
}) {
	const postsCountString = new Intl.NumberFormat("ko-KR", {
		notation: "compact",
	}).format(postCount!);

	return (
		<div>
			<UserProfile profile={profile} />
			<Username name={name} handle={handle} />
			<Description description={description} />
			<div className="flex gap-x-2">
				<Link href={`/${handle}/followers`}>
					{followerCount}명의 팔로워
				</Link>
				<Link href={`/${handle}/following`}>
					{followingCount}명을 팔로우 중
				</Link>
			</div>
			<p>{postsCountString}개의 게시글</p>
		</div>
	);
}
