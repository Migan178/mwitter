"use client";

import useCreatePostStatusState from "@/stores/createPostStatus";

export default function ContentInput() {
	const content = useCreatePostStatusState(state => state.content);
	const setContent = useCreatePostStatusState(state => state.setContent);

	return (
		<div>
			<textarea
				placeholder="포스트 내용을 입력"
				name="content"
				value={content}
				onChange={e => setContent(e.target.value)}
				required
			></textarea>
		</div>
	);
}
