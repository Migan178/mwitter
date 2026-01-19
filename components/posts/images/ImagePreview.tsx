"use client";

import Image from "next/image";
import { XLg } from "react-bootstrap-icons";

export default function ImagePreview({
	preview,
	removeImage,
}: {
	preview: string;
	removeImage: () => void;
}) {
	return (
		<div className="relative h-40 w-40 shrink-0">
			<button
				className="floating-button top-3 right-4 z-10"
				onClick={removeImage}
			>
				<XLg />
			</button>
			<Image
				src={preview}
				alt="asdf"
				className="object-cover rounded-2xl"
				unoptimized
				fill
			/>
		</div>
	);
}
