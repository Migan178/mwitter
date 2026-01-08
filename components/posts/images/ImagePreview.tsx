"use client";

import Image from "next/image";

export default function ImagePreview({
	url,
	removeImage,
}: {
	url: string;
	removeImage: () => void;
}) {
	return (
		<div className="relative h-40 w-40 shrink-0">
			<div className="absolute z-10 right-4 top-3 bg-black/50 w-8 h-8 rounded-full">
				<button
					className="w-full h-full text-white"
					onClick={removeImage}
				>
					{/* TODO: bootstrap-icon의 X로 변경 */}X
				</button>
			</div>
			<Image
				src={url}
				alt="asdf"
				className="object-cover rounded-2xl"
				fill
			/>
		</div>
	);
}
