import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum PostTabEnum {
	All = 0,
	Following,
}

export interface PostTab {
	currentTab: PostTabEnum;
	setAllPosts: () => void;
	setFollowingPosts: () => void;
}

const usePostTabStore = create<PostTab>()(
	persist(
		set => ({
			currentTab: PostTabEnum.All,
			setAllPosts: () => set(() => ({ currentTab: PostTabEnum.All })),
			setFollowingPosts: () =>
				set(() => ({ currentTab: PostTabEnum.Following })),
		}),
		{ name: "main-post-tab" },
	),
);

export default usePostTabStore;
