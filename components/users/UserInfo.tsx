import Description from "./Description";
import Username from "./Username";
import Link from "next/link";

export default function UserInfo({
	name,
	handle,
	followers,
	following,
	description,
	posts,
}: {
	name: string;
	handle: string;
	followers: number;
	following: number;
	description: string | null;
	posts: number;
}) {
	const postsCountString = new Intl.NumberFormat("ko-KR", {
		notation: "compact",
	}).format(posts);

	return (
		<div>
			<Username name={name} handle={handle} />
			<Description description={description} />
			<div className="flex gap-x-2">
				<Link href={`/${handle}/followers`}>
					{followers}명의 팔로워
				</Link>
				<Link href={`/${handle}/following`}>
					{following}명을 팔로우 중
				</Link>
			</div>
			<p>{postsCountString}개의 게시글</p>
		</div>
	);
}
