import { create } from "zustand";

export enum SearchTabEnum {
	Posts = 0,
	Users,
}

export interface SearchTab {
	currentTab: SearchTabEnum;
	actions: {
		setPostsSearch: () => void;
		setUsersSearch: () => void;
	};
}

const useSearchTabStore = create<SearchTab>(set => ({
	currentTab: SearchTabEnum.Posts,
	actions: {
		setPostsSearch: () => set(() => ({ currentTab: SearchTabEnum.Posts })),
		setUsersSearch: () => set(() => ({ currentTab: SearchTabEnum.Users })),
	},
}));
export default useSearchTabStore;
