"use client";

import Modal from "../Modal";
import NameInput from "../signup/NameInput";
import DescriptionInput from "./DescriptionInput";
import EditProfilePictureButton from "./EditProfilePictureButton";
import ProfilePictureCropperModal from "./ProfilePictureCropperModal";
import { editProfile } from "@/actions/editProfile";
import { type UserWithoutFollowingResult } from "@/lib/services/user";
import useUserDataStore from "@/stores/userData";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import {
	ChangeEvent,
	useActionState,
	useEffect,
	useRef,
	useState,
} from "react";

export default function ProfileEdit({
	initialData: user,
}: {
	initialData: UserWithoutFollowingResult;
}) {
	user = user!;
	const defaultPfP = "/defaults/default_profile.png";

	const [isVerified, setVerified] = useState(true);
	const [description, setDescription] = useState(user.description || "");
	const [state, formAction, pending] = useActionState(editProfile, {
		success: false,
		message: "",
	});
	const [name, setName] = useState(user.name);
	const [showCropper, setShowCropper] = useState(false);
	const [profile, setProfile] = useState(user.profile);
	const setUserDataName = useUserDataStore(state => state.setName);
	const setUserDataProfile = useUserDataStore(state => state.setProfile);

	const pathname = usePathname();
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (state.success) {
			router.back();
		}
	}, [state]);

	async function handleSubmit(formData: FormData) {
		let filename: string | undefined;

		// 만약 프로필 사진에 변동이 있다면 (기본 사진 X)
		if (profile !== user.profile && profile !== defaultPfP) {
			filename = `${user.id}_profile.png`;

			const res = await fetch(profile);
			const blob = await res.blob();

			formData.set(
				"profile",
				new File([blob], filename, {
					type: "image/png",
				}),
			);
		} else {
			// 만약 프로필 사진에 변동이 없거나, 기본 사진으로 선택했을 때
			formData.set("profile", profile);
		}

		formAction(formData);

		if (state.success) {
			if (filename) setUserDataProfile(`/uploads/profile/${filename}`);
			setUserDataName(formData.get("name")!.toString());
		}
	}

	function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || !e.target.files.length) return;
		const file = e.target.files[0];
		const imageDataUrl = URL.createObjectURL(file);
		setProfile(imageDataUrl);
		setShowCropper(true);
	}

	return (
		<>
			<div className="bg-white p-8 flex flex-col gap-y-8">
				<div className="flex justify-between">
					<div>
						<button
							onClick={router.back}
							className="hover:cursor-pointer text-start"
						>
							닫기
						</button>
					</div>
					<div>
						<input
							type="submit"
							className="hover:cursor-pointer"
							value="수정"
							form="profile-edit-form"
							disabled={!isVerified || pending}
						/>
					</div>
				</div>
				<div className="flex gap-x-2">
					<EditProfilePictureButton
						fileInputRef={fileInputRef}
						setProfile={setProfile}
						profile={profile}
					/>
					<Form action={handleSubmit} id="profile-edit-form">
						<input
							type="hidden"
							value={user.profile}
							name="prevProfile"
						/>
						<input
							type="hidden"
							value={pathname}
							name="currentPath"
						/>
						<NameInput
							name={name}
							setName={setName}
							setVerified={setVerified}
						/>
						<DescriptionInput
							description={description}
							setDescription={setDescription}
							setVerified={setVerified}
						/>
						{!state?.success ? (
							<p className="text-red-500">{state?.message}</p>
						) : null}
					</Form>
				</div>
			</div>
			{showCropper ? (
				<Modal>
					<ProfilePictureCropperModal
						profile={profile}
						closeModal={() => setShowCropper(false)}
						onCropComplete={setProfile}
					/>
				</Modal>
			) : null}
			<input
				className="hidden"
				type="file"
				accept="image/*"
				onChange={onFileChange}
				ref={fileInputRef}
			/>
		</>
	);
}
