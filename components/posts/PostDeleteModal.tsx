"use client";

import Modal from "../Modal";
import { deletePost } from "@/actions/deletePost";
import Form from "next/form";
import { usePathname } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function PostDeleteModal({
	postId,
	closeMenu,
}: {
	postId: number;
	closeMenu: () => void;
}) {
	const pathname = usePathname();

	const [state, formAction] = useActionState(deletePost, null);

	useEffect(() => {
		if (state?.success) {
			closeMenu();
		}
	}, [closeMenu, state?.success]);

	return (
		<Modal>
			<div className="relative bg-white p-8 z-110">
				<Form action={formAction}>
					<input type="hidden" name="postId" value={postId} />
					<input type="hidden" name="currentPath" value={pathname} />
					<h1>진짜 삭제하시겠습니까?</h1>
					<div className="flex justify-between">
						<button onClick={closeMenu} className="primary-button">
							취소
						</button>
						<button type="submit">삭제</button>
					</div>
				</Form>
			</div>
			{state && !state.success ? (
				<p className="text-red-500">{state.error}</p>
			) : null}
		</Modal>
	);
}
