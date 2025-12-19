"use client";

import useSearchTabStore, { SearchTabEnum } from "@/stores/searchTab";

export default function SwitchSearchTabButton() {
	const currentTab = useSearchTabStore(state => state.currentTab);
	const { setPostsSearch, setUsersSearch } = useSearchTabStore(
		state => state.actions,
	);

	return (
		<div className="flex gap-x-1">
			<button onClick={setPostsSearch} className="hover:cursor-pointer">
				게시글 {currentTab === SearchTabEnum.Posts ? "(선택됨)" : null}
			</button>
			<button onClick={setUsersSearch} className="hover:cursor-pointer">
				유저 {currentTab === SearchTabEnum.Users ? "(선택됨)" : null}
			</button>
		</div>
	);
}
