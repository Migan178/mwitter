import UserProfile from "../users/UserProfile";
import { RefObject, useState } from "react";

export default function EditProfilePictureButton({
	fileInputRef,
	setProfile,
	profile,
}: {
	fileInputRef: RefObject<HTMLInputElement | null>;
	setProfile: (profile: string) => void;
	profile: string;
}) {
	const defaultPfP = "/defaults/default_profile.png";

	const [showPfPMenu, setShowPfPMenu] = useState(false);

	function handleSelectPicture() {
		fileInputRef.current?.click();
		setShowPfPMenu(false);
	}

	function handleResetToDefaultPicture() {
		setProfile(defaultPfP);
		setShowPfPMenu(false);
	}

	return (
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
				<button onClick={handleSelectPicture}>다른 사진 선택</button>
			</div>
		</div>
	);
}
