"use client";

import ImagePreview from "./ImagePreview";
import { type Image } from "@/stores/drafts";

export default function ImagePreviewList({
	images,
	setImages,
}: {
	images: Image[];
	setImages: (files: Image[]) => void;
}) {
	return (
		<ol className="flex w-70 gap-x-2 overflow-x-auto">
			{images.map(image => (
				<li key={image.file.name}>
					<ImagePreview
						file={image.file}
						removeImage={() => {
							setImages(images.filter(file => file !== image));
						}}
					/>
				</li>
			))}
		</ol>
	);
}
