"use client";

import { Area } from "react-easy-crop";

/** @description 받은 URL을 html의 img 요소로 반환 */
function createImage(url: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", reject);
		image.src = url;
	});
}

/** @description canvas를 이용하여 크롭된 이미지를 반환 */
export async function getCroppedImage(imageSrc: string, area: Area) {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;

	canvas.width = 512;
	canvas.height = 512;

	ctx.drawImage(
		image,
		area.x,
		area.y,
		area.width,
		area.height,
		0,
		0,
		canvas.width,
		canvas.height,
	);

	return new Promise<string>(resolve => {
		canvas.toBlob(file => {
			resolve(URL.createObjectURL(file!));
		}, "image/png");
	});
}
