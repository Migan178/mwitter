"use client";

export default function ContentInput({
	content,
	setContent,
}: {
	content: string;
	setContent: (content: string) => void;
}) {
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
