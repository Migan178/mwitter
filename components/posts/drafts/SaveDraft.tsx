"use client";

import Modal from "../../Modal";
import useDraftStore from "@/stores/drafts";
import { useRouter } from "next/navigation";

export default function SaveDraft({
	content,
	parentId,
}: {
	content: string;
	parentId: number | null;
}) {
	const router = useRouter();
	const addDraft = useDraftStore(state => state.addDraft);

	function saveDraft() {
		addDraft({
			content,
			parentId,
		});

		router.back();
	}

	return (
		<Modal>
			<div className="bg-white p-8">
				<p>해당 게시글을 임시 저장 하시겠어요, 아니면 버리시겠어요?</p>
				<div className="flex gap-x-2">
					<div>
						<button onClick={saveDraft}>저장</button>
					</div>
					<div>
						<button onClick={router.back}>버리기</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
