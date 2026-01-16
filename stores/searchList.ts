import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchList {
	searchList: string[];
	addSearch: (search: string) => void;
	removeSearch: (search: string) => void;
	removeAllSearch: () => void;
}

const useSearchListStore = create<SearchList>()(
	persist(
		set => ({
			searchList: [],
			addSearch: search =>
				set(state => {
					let list = [...state.searchList];
					if (list.includes(search))
						list = list.filter(item => item !== search);

					return { searchList: [search, ...list] };
				}),
			removeSearch: search =>
				set(state => ({
					searchList: state.searchList.filter(
						list => list !== search,
					),
				})),
			removeAllSearch: () => set(() => ({ searchList: [] })),
		}),
		{
			name: "search-list",
		},
	),
);

export default useSearchListStore;
