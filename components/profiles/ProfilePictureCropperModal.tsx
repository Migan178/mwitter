"use client";

import { getCroppedImage } from "@/lib/editProfilePicture";
import { ChangeEvent, useState } from "react";
import Cropper from "react-easy-crop";

export default function ProfilePictureCropperModal({
	closeModal,
	onCropComplete,
}: {
	closeModal: () => void;
	onCropComplete: (croppedImage: Blob) => void;
}) {
	const [profile, setProfile] = useState("");
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

	async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || e.target.files.length < 0) return;
		const file = e.target.files[0];
		const imageDataUrl = await readFile(file);
		setProfile(imageDataUrl);
	}

	return (
		<div className="bg-white w-lg h-134 p-8 pb-14">
			<div className="flex justify-between">
				<button onClick={closeModal}>취소</button>
				<button onClick={handleSave}>완료</button>
			</div>
			{profile ? (
				<div className="relative w-full h-full">
					<Cropper
						image={profile}
						crop={crop}
						zoom={zoom}
						aspect={1}
						onCropChange={setCrop}
						onCropComplete={(_, pixels) =>
							setCroppedAreaPixels(pixels)
						}
						onZoomChange={setZoom}
						cropShape="round"
					/>
				</div>
			) : (
				<input type="file" accept="image/*" onChange={onFileChange} />
			)}
		</div>
	);
}

function readFile(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () =>
			resolve(reader.result?.toString()!),
		);
		reader.addEventListener("error", reject);
		reader.readAsDataURL(file);
	});
}
