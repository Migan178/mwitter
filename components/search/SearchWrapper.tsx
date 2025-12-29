"use client";

import PostList from "../posts/PostList";
import { UserList } from "../users/UserList";
import { type PostResult } from "@/lib/services/post";
import { type UserResult } from "@/lib/services/user";
import useSearchTabStore, { SearchTabEnum } from "@/stores/searchTab";

export default function SearchWrapper({
	posts,
	users,
}: {
	posts: PostResult[];
	users: UserResult[];
}) {
	const currentTab = useSearchTabStore(state => state.currentTab);

	switch (currentTab) {
		case SearchTabEnum.Posts:
			return <PostList posts={posts} />;
		case SearchTabEnum.Users:
			return <UserList users={users} />;
	}
}
