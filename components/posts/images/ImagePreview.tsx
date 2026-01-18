"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { XLg } from "react-bootstrap-icons";

export default function ImagePreview({
	file,
	removeImage,
}: {
	file: File;
	removeImage: () => void;
}) {
	const url = useMemo(() => URL.createObjectURL(file), [file]);

	useEffect(() => () => URL.revokeObjectURL(url), [url]);

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
