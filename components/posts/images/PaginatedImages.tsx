"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaretLeftFill, CaretRightFill, XLg } from "react-bootstrap-icons";

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
			<button
				className="floating-button top-8 left-8"
				onClick={router.back}
			>
				<XLg />
			</button>
			{currentIndex > 0 ? (
				<button
					className="floating-button top-1/2 left-8"
					onClick={() => setCurrentIndex(currentIndex - 1)}
				>
					<CaretLeftFill />
				</button>
			) : null}
			{currentIndex < images.length - 1 ? (
				<button
					className="floating-button top-1/2 right-8"
					onClick={() => setCurrentIndex(currentIndex + 1)}
				>
					<CaretRightFill />
				</button>
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
