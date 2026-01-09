import Image from "next/image";
import Link from "next/link";

export default function PostImageList({
	handle,
	postId,
	images,
}: {
	handle: string;
	postId: number;
	images: { order: number; url: string }[];
}) {
	images.sort((a, b) => a.order - b.order);

	return (
		<ol className="flex w-full gap-x-2 overflow-x-auto">
			{images.map((image, i) => (
				<li
					key={Math.floor(Math.random() * 1000)}
					className="relative h-50 shrink-0"
				>
					<Link
						href={`/${handle}/posts/${postId}/media/${i}`}
						scroll={false}
					>
						<Image
							src={image.url}
							alt="asdf"
							className="object-cover rounded-2xl w-auto h-full"
							width={160}
							height={160}
						/>
					</Link>
				</li>
			))}
		</ol>
	);
}
