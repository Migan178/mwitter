import Form from "next/form";

export default function SearchBox({ defaultValue }: { defaultValue?: string }) {
	return (
		<Form action="/search">
			<div>
				<input
					type="text"
					name="q"
					placeholder="검색어를 입력"
					className="placeholder:text-center"
					defaultValue={defaultValue}
					required
				/>
			</div>
			<div>
				<input type="button" value="해당 검색어로 이동" />
			</div>
		</Form>
	);
}
