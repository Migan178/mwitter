"use client";

import NameInput from "../signup/NameInput";
import DescriptionInput from "./DescriptionInput";
import { editProfile } from "@/actions/editProfile";
import { type UserResult } from "@/lib/services/user";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function ProfileEdit({
	initialData: user,
}: {
	initialData: UserResult;
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

	if (state.success) {
		router.back();
	}

	return (
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
			<Form action={formAction} id="profile-edit-form">
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
	);
}
