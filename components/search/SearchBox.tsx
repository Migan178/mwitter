"use client";

import useSearchListStore from "@/stores/searchList";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";
import { Search } from "react-bootstrap-icons";

export default function SearchBox({ defaultValue }: { defaultValue?: string }) {
	const addSearch = useSearchListStore(state => state.addSearch);
	const router = useRouter();

	const queryInputRef = useRef<HTMLInputElement>(null);

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		const query = queryInputRef.current?.value;
		if (!query) {
			e.preventDefault();

			router.push("/search");
			return;
		}

		addSearch(query);
	}

	return (
		<Form
			action="/search"
			className="py-4 px-8 gray-border flex justify-between gap-x-3"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				name="q"
				placeholder="검색어를 입력"
				className="placeholder:text-gray-300 grow"
				defaultValue={defaultValue}
				ref={queryInputRef}
			/>
			<button type="submit" className="primary-button">
				<div className="flex gap-x-1 justify-center items-center">
					<Search />
					검색
				</div>
			</button>
		</Form>
	);
}
