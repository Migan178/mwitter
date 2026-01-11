import Link from "next/link";
import { Repeat } from "react-bootstrap-icons";

export default function RepostedBy({
	name,
	handle,
}: {
	name: string;
	handle: string;
}) {
	return (
		<Link
			href={`/${handle}`}
			className="text-gray-500 flex gap-x-1 items-center"
		>
			<Repeat />
			{name}님이 재게시함
		</Link>
	);
}
