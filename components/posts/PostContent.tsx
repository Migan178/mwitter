import hashTagRegexp from "@/lib/regex/hashTag";
import userMentionRegexp from "@/lib/regex/userMention";
import Link from "next/link";

export default function PostContent({ content }: { content: string }) {
	const parts = content.split(/\ +/g);

	return (
		<p className="whitespace-pre-wrap">
			{parts.map((part, i) => {
				if (part.match(userMentionRegexp)) {
					return (
						<Link
							href={`/${part.replace("@", "")}`}
							key={i}
							className="mr-1 text-blue-500"
						>
							{part}
						</Link>
					);
				}

				if (part.match(hashTagRegexp)) {
					return (
						<Link
							href={{
								pathname: "/search",
								query: { q: part },
							}}
							key={i}
							className="mr-1 text-blue-500"
						>
							{part}
						</Link>
					);
				}

				return part;
			})}
		</p>
	);
}
