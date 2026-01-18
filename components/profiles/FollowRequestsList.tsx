"use client";

import ToastAlert from "../ToastAlert";
import FollowRequest from "./FollowRequest";
import { type ProfileResult } from "@/lib/services/user";
import useUserDataStore from "@/stores/userData";
import { useCallback, useState } from "react";

export default function FollowRequestsList({
	users,
}: {
	users: ProfileResult[];
}) {
	const isProtected = useUserDataStore(state => state.protected);

	const [requests, setRequests] = useState(users);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const removeRequest = useCallback(
		(userId: number) =>
			setRequests(requests.filter(request => request.id !== userId)),
		[requests],
	);

	if (!isProtected) {
		return (
			<div className="w-140 gray-border p-2">
				<h1>해당 기능은 보호된 계정만 사용 가능</h1>
			</div>
		);
	}

	if (!requests.length) {
		return (
			<div className="w-140 gray-border p-2">
				<h1>대기 중인 팔로우 요청이 없음.</h1>
			</div>
		);
	}

	return (
		<>
			<ul className="w-140 gray-border">
				{requests.map((user, i) => (
					<li key={user.id}>
						<FollowRequest
							user={user}
							removeRequest={removeRequest}
							setErrorMessage={setErrorMessage}
						/>
						{i < requests.length - 1 ? (
							<hr className="border-gray-300" />
						) : null}
					</li>
				))}
			</ul>
			{errorMessage ? <ToastAlert>{errorMessage}</ToastAlert> : null}
		</>
	);
}
