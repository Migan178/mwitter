"use client";

import AcceptButton from "../buttons/AcceptButton";
import DeclineButton from "../buttons/DeclineButton";
import UserListItem from "../users/UserListItem";
import { acceptFollow } from "@/actions/follow/requests/acceptFollow";
import { declineFollow } from "@/actions/follow/requests/declineFollow";
import { type ProfileResult } from "@/lib/services/user";
import { startTransition, useActionState, useEffect } from "react";

export default function FollowRequest({
	user,
	removeRequest,
	setErrorMessage,
}: {
	user: ProfileResult;
	removeRequest: () => void;
	setErrorMessage: (error: string | null) => void;
}) {
	const [acceptState, acceptAction] = useActionState(acceptFollow, null);
	const [declineState, declineAction] = useActionState(declineFollow, null);

	useEffect(() => {
		if (typeof acceptState !== "boolean") return;

		if (!acceptState) {
			setErrorMessage("팔로우 수락하는 도중 에러 발생.");

			const timeout = setTimeout(() => setErrorMessage(null), 4000);

			return () => clearTimeout(timeout);
		}

		removeRequest();
	}, [acceptState]);

	useEffect(() => {
		if (typeof declineState !== "boolean") return;

		if (!declineState) {
			setErrorMessage("팔로우 거절하는 도중 에러 발생.");

			const timeout = setTimeout(() => setErrorMessage(null), 4000);

			return () => clearTimeout(timeout);
		}

		removeRequest();
	}, [declineState]);

	return (
		<div className="flex justify-between p-2">
			<UserListItem user={user} showFollowButton={false} />
			<div className="flex gap-x-2">
				<DeclineButton
					onClick={() =>
						startTransition(() => declineAction(user.id))
					}
				/>
				<AcceptButton
					onClick={() => startTransition(() => acceptAction(user.id))}
				/>
			</div>
		</div>
	);
}
