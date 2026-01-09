"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaginatedImages({
	url,
	index,
	images,
}: {
	url: string;
	index: number;
	images: { order: number; url: string }[];
}) {
	images.sort((a, b) => a.order - b.order);

	const [currentIndex, setCurrentIndex] = useState(index);

	const router = useRouter();

	useEffect(() => {
		router.replace(`${url}/${currentIndex}`, { scroll: false });
	}, [currentIndex]);

	return (
		<div className="relative bg-black w-full h-screen justify-center flex">
			<div className="absolute top-8 left-8 bg-black/50 w-8 h-8 rounded-full">
				<button
					className="text-white w-full h-full"
					onClick={router.back}
				>
					X
				</button>
			</div>
			{/* bootstrap-icons의 화살표로 변경*/}
			{currentIndex > 0 ? (
				<div className="absolute bg-black/50 left-8 top-1/2 w-8 h-8 rounded-full">
					<button
						className="text-white w-full h-full"
						onClick={() => setCurrentIndex(currentIndex - 1)}
					>
						{"<"}
					</button>
				</div>
			) : null}
			{currentIndex < images.length - 1 ? (
				<div className="absolute bg-black/50 right-8 top-1/2 w-8 h-8 rounded-full">
					<button
						className="text-white w-full h-full"
						onClick={() => setCurrentIndex(currentIndex + 1)}
					>
						{">"}
					</button>
				</div>
			) : null}
			<Image
				src={images[currentIndex].url}
				alt="asdf"
				width={800}
				height={800}
				className="w-auto h-full max-w-full object-contain"
				priority
			/>
		</div>
	);
}
