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
			<h1>{name}</h1>
			<h2>@{handle}</h2>
			<div>
				<button>{followers}명의 팔로워</button>
				<button>{following}명을 팔로우 중</button>
				<p>{postsCountString}개의 게시글</p>
			</div>
		</div>
	);
}
