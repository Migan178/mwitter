import Link from "next/link";

export default function ReplyTo({ reply }: { reply: string }) {
	return (
		<Link href={`/${reply}`} className="text-gray-500">
			<span className="text-blue-500">@{reply}</span>님에게 답장 중
		</Link>
	);
}
