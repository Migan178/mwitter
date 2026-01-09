"use client";

import Image from "next/image";
import { XLg } from "react-bootstrap-icons";

export default function ImagePreview({
	url,
	removeImage,
}: {
	url: string;
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
				src={url}
				alt="asdf"
				className="object-cover rounded-2xl"
				fill
			/>
		</div>
	);
}
