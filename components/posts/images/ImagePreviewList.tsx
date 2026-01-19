"use client";

import ImagePreview from "./ImagePreview";
import useCreatePostStatusState from "@/stores/createPostStatus";

export default function ImagePreviewList() {
	const images = useCreatePostStatusState(state => state.images);
	const setImages = useCreatePostStatusState(state => state.setImages);

	return (
		<ol className="flex w-70 gap-x-2 overflow-x-auto">
			{images.map(image => (
				<li key={image.file.name}>
					<ImagePreview
						preview={image.preview}
						removeImage={() => {
							setImages(images.filter(file => file !== image));
							image.revokePreview();
						}}
					/>
				</li>
			))}
		</ol>
	);
}
