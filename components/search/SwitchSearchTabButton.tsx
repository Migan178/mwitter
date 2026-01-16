"use client";

import useSearchTabStore, { SearchTabEnum } from "@/stores/searchTab";

export default function SwitchSearchTabButton() {
	const currentTab = useSearchTabStore(state => state.currentTab);
	const { setPostsSearch, setUsersSearch } = useSearchTabStore(
		state => state.actions,
	);

	return (
		<div className="flex">
			<button
				onClick={setPostsSearch}
				className="w-1/2 border-r border-gray-300 p-2"
			>
				게시글 {currentTab === SearchTabEnum.Posts ? "(선택됨)" : null}
			</button>
			<button onClick={setUsersSearch} className="w-1/2 p-2">
				유저 {currentTab === SearchTabEnum.Users ? "(선택됨)" : null}
			</button>
		</div>
	);
}
