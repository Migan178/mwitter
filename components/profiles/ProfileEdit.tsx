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
	const router = useRouter();
	const [showCropper, setShowCropper] = useState(false);
	const [profile, setProfile] = useState(user.profile);
	const [showPfPMenu, setShowPfPMenu] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (state.success) {
			router.back();
		}
	}, [state]);

	async function handleSubmit(formData: FormData) {
		// 만약 프로필 사진에 변동이 있다면 (기본 사진 X)
		if (profile !== user.profile && profile !== defaultPfP) {
			const res = await fetch(profile);
			const blob = await res.blob();

			formData.set(
				"profile",
				new File([blob], `${user.id}_profile.png`, {
					type: "image/png",
				}),
			);

			formAction(formData);
			return;
		}

		// 만약 프로필 사진에 변동이 없거나, 기본 사진으로 선택했을 때
		formData.set("profile", profile);

		formAction(formData);
	}

	async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (!e.target.files || e.target.files.length < 0) return;
		const file = e.target.files[0];
		const imageDataUrl = await readFile(file);
		setProfile(imageDataUrl);
		setShowCropper(true);
	}

	function handleSelectPicture() {
		fileInputRef.current?.click();
		setShowPfPMenu(false);
	}

	function handleResetToDefaultPicture() {
		setProfile(defaultPfP);
		setShowPfPMenu(false);
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
					<div className="relative">
						<button
							onClick={() => setShowPfPMenu(!showPfPMenu)}
							className="relative w-30 h-30 group"
						>
							<div className="group-hover:brightness-50 duration-200">
								<UserProfile profile={profile} size={120} />
							</div>
							<span className="group-hover:opacity-100 opacity-0 top-1/2 left-1/2 -translate-1/2 absolute text-xs text-white duration-200">
								프로필 사진 수정
							</span>
						</button>
						<div
							className={`absolute top-30 min-w-31 bg-white p-4 shadow-2xl duration-200 ${showPfPMenu ? "opacity-100" : "opacity-0 pointer-events-none"}`}
						>
							<button onClick={handleResetToDefaultPicture}>
								기본 사진 선택
							</button>
							<button onClick={handleSelectPicture}>
								다른 사진 선택
							</button>
						</div>
					</div>
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
