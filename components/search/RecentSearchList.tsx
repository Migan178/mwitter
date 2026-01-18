"use client";

import useSearchListStore from "@/stores/searchList";
import Link from "next/link";
import { X } from "react-bootstrap-icons";

export default function RecentSearchList() {
	const searchList = useSearchListStore(state => state.searchList);
	const removeSearch = useSearchListStore(state => state.removeSearch);
	const removeAllSearch = useSearchListStore(state => state.removeAllSearch);

	if (!searchList.length)
		return (
			<div className="gray-border p-2">
				<h1>최근 검색 기록 없음</h1>
			</div>
		);

	return (
		<div className="border-gray-300 border border-t-0 relative">
			<button onClick={() => removeAllSearch()} className="p-2">
				전체 삭제
			</button>
			<ul>
				{searchList.map(query => (
					<li key={query} className="p-2 w-full h-fit relative">
						<div className="flex justify-between">
							<h1>{query}</h1>
							<button
								className="z-10"
								onClick={() => {
									removeSearch(query);
								}}
							>
								<X />
							</button>
						</div>
						<Link
							href={{ href: "/search", query: { q: query } }}
							className="absolute w-full h-full z-1 top-0 left-0"
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
