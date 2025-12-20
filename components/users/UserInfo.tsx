import Username from "./Username";
import Link from "next/link";

export default function UserInfo({
	name,
	handle,
	followers,
	following,
	posts,
}: {
	name: string;
	handle: string;
	followers: number;
	following: number;
	posts: number;
}) {
	const postsCountString = new Intl.NumberFormat("ko-KR", {
		notation: "compact",
	}).format(posts);

	return (
		<div>
			<Username name={name} handle={handle} />
			<div>
				<Link href={`/${handle}/followers`}>
					{followers}명의 팔로워
				</Link>
				<Link href={`/${handle}/following`}>
					{following}명을 팔로우 중
				</Link>
				<p>{postsCountString}개의 게시글</p>
			</div>
		</div>
	);
}
