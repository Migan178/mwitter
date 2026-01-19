"use client";

import useCreatePostStatusState from "@/stores/createPostStatus";
import { ChangeEvent, useRef } from "react";

export default function ContentInput() {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const content = useCreatePostStatusState(state => state.content);
	const setContent = useCreatePostStatusState(state => state.setContent);

	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		setContent(e.target.value);

		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			const scrollHeight = textareaRef.current.scrollHeight;
			textareaRef.current.style.height = scrollHeight + "px";
		}
	}

	return (
		<div>
			<textarea
				placeholder="포스트 내용을 입력"
				name="content"
				value={content}
				ref={textareaRef}
				onChange={handleChange}
				className="resize-none w-full"
				rows={4}
				required
			></textarea>
		</div>
	);
}
