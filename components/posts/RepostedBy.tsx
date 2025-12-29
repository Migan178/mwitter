import Link from "next/link";

export default function RepostedBy({
	name,
	handle,
}: {
	name: string;
	handle: string;
}) {
	return (
		<Link href={`/${handle}`} className="text-gray-500">
			{name}님이 재게시함
		</Link>
	);
}
