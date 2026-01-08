"use client";

import ImagePreview from "./ImagePreview";
import { type Image } from "@/stores/drafts";
import { useEffect, useState } from "react";

export default function ImagePreviewList({
	images,
	setImages,
}: {
	images: Image[];
	setImages: (files: Image[]) => void;
}) {
	const [previews, setPreviews] = useState<
		{ id: number; url: string; image: Image }[]
	>([]);

	useEffect(() => {
		setPreviews(
			images.map(image => ({
				id: Math.floor(Math.random() * 1000),
				url: URL.createObjectURL(image.file),
				image,
			})),
		);

		() => previews.forEach(preview => URL.revokeObjectURL(preview.url));
	}, [images]);

	return (
		<ol className="flex w-70 gap-x-2 overflow-x-auto">
			{previews.map(preview => (
				<li key={preview.id}>
					<ImagePreview
						url={preview.url}
						removeImage={() => {
							setPreviews(
								previews.filter(
									image => image.id !== preview.id,
								),
							);
							setImages(
								images.filter(image => image !== preview.image),
							);

							URL.revokeObjectURL(preview.url);
						}}
					/>
				</li>
			))}
		</ol>
	);
}
