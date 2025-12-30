"use client";

import usePostTabStore, { PostTabEnum } from "@/stores/postTab";

export default function SwitchPostsTabButton() {
	const currentTab = usePostTabStore(state => state.currentTab);
	const setAllPosts = usePostTabStore(state => state.setAllPosts);
	const setFollowingPosts = usePostTabStore(state => state.setFollowingPosts);

	return (
		<div className="flex p-2">
			<button onClick={setAllPosts} className="w-1/2">
				전체 {currentTab === PostTabEnum.All ? "(선택됨)" : null}
			</button>
			<button onClick={setFollowingPosts} className="w-1/2">
				팔로잉
				{currentTab === PostTabEnum.Following ? "(선택됨)" : null}
			</button>
		</div>
	);
}
