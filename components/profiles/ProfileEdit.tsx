"use client";

import Modal from "../Modal";
import NameInput from "../signup/NameInput";
import UserProfile from "../users/UserProfile";
import DescriptionInput from "./DescriptionInput";
import ProfilePictureCropperModal from "./ProfilePictureCropperModal";
import { editProfile } from "@/actions/editProfile";
import { type UserWithoutFollowingResult } from "@/lib/services/user";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function ProfileEdit({
	initialData: user,
}: {
	initialData: UserWithoutFollowingResult;
}) {
	user = user!;
	const [isVerified, setVerified] = useState(true);
	const [description, setDescription] = useState(user.description || "");
	const [state, formAction, pending] = useActionState(editProfile, {
		success: false,
		message: "",
	});
	const [name, setName] = useState(user.name);
	const router = useRouter();
	const [showCropper, setShowCropper] = useState(false);
	const [profile, setProfile] = useState<Blob | null>(null);

	useEffect(() => {
		if (state.success) {
			router.back();
		}
	}, [state]);

	function handleSubmit(formData: FormData) {
		formData.set(
			"profile",
			// 만약 유저가 프로필 사진을 변경했다면 해당 파일을, 아니라면 원래의 주소를 보냄
			profile
				? new File([profile], `${user.id}_profile.png`, {
						type: "image/png",
					})
				: user.profile,
		);
		formAction(formData);
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
					<button
						onClick={() => setShowCropper(!showCropper)}
						className="relative w-30 h-30 group"
					>
						<div className="group-hover:brightness-50 duration-200">
							<UserProfile
								profile={
									profile
										? URL.createObjectURL(profile)
										: user.profile
								}
								size={120}
							/>
						</div>
						<span className="group-hover:opacity-100 opacity-0 top-1/2 left-1/2 -translate-1/2 absolute text-xs text-white duration-200">
							프로필 사진 수정
						</span>
					</button>
					<Form action={handleSubmit} id="profile-edit-form">
						<input
							type="hidden"
							value={user.profile}
							name="prevProfile"
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
						closeModal={() => setShowCropper(false)}
						onCropComplete={profile => setProfile(profile)}
					/>
				</Modal>
			) : null}
		</>
	);
}
