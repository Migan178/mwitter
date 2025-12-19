"use client";

import usePostTabStore, { PostTabEnum } from "@/stores/postTab";

export default function SwitchPostsTabButton() {
	const currentTab = usePostTabStore(state => state.currentTab);
	const { setAllPosts, setFollowingPosts } = usePostTabStore(
		state => state.actions,
	);

	return (
		<div className="flex gap-x-1">
			<button onClick={setAllPosts} className="hover:cursor-pointer">
				전체 {currentTab === PostTabEnum.All ? "(선택됨)" : null}
			</button>
			<button
				onClick={setFollowingPosts}
				className="hover:cursor-pointer"
			>
				팔로잉
				{currentTab === PostTabEnum.Following ? "(선택됨)" : null}
			</button>
		</div>
	);
}
