"use client";

import { getCroppedImage } from "@/lib/editProfilePicture";
import { useState } from "react";
import Cropper from "react-easy-crop";

export default function ProfilePictureCropperModal({
	profile,
	closeModal,
	onCropComplete,
}: {
	profile: string;
	closeModal: () => void;
	onCropComplete: (croppedImage: string) => void;
}) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	async function handleSave() {
		const croppedImage = await getCroppedImage(profile, croppedAreaPixels);
		onCropComplete(croppedImage!);
		closeModal();
	}

	return (
		<div className="bg-white w-lg h-134 p-8 pb-14">
			<div className="flex justify-between">
				<button onClick={closeModal}>취소</button>
				<button onClick={handleSave}>완료</button>
			</div>
			<div className="relative w-full h-full">
				<Cropper
					image={profile}
					crop={crop}
					zoom={zoom}
					aspect={1}
					onCropChange={setCrop}
					onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
					onZoomChange={setZoom}
					cropShape="round"
				/>
			</div>
		</div>
	);
}
