"use client";

import { type Draft } from "@/stores/drafts";
import Image from "next/image";

export default function Draft({
	draft,
	applyDraft,
	preview,
}: {
	draft: Draft;
	applyDraft: (draft: Draft) => void;
	preview?: string;
}) {
	console.log(preview);

	return (
		<button
			onClick={() => applyDraft(draft)}
			className="flex gap-x-1 w-full p-2"
		>
			{preview ? (
				<Image
					src={preview}
					alt="미리보기 사진"
					width={80}
					height={80}
				/>
			) : null}
			{draft.content || "게시글 내용 없음"}
		</button>
	);
}
