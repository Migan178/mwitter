import { create } from "zustand";

export enum PostTabEnum {
	All = 0,
	Following,
}

export interface PostTab {
	currentTab: PostTabEnum;
	actions: {
		setAllPosts: () => void;
		setFollowingPosts: () => void;
	};
}

const usePostTabStore = create<PostTab>(set => ({
	currentTab: PostTabEnum.All,
	actions: {
		setAllPosts: () => set(() => ({ currentTab: PostTabEnum.All })),
		setFollowingPosts: () =>
			set(() => ({ currentTab: PostTabEnum.Following })),
	},
}));

export default usePostTabStore;
