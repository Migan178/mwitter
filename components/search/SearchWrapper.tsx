"use client";

import PostList from "../posts/PostList";
import { UserList } from "../users/UserList";
import { PostsWithLikesResult } from "@/lib/services/post";
import { UsersWithFollowingResult } from "@/lib/services/user";
import useSearchTabStore, { SearchTabEnum } from "@/stores/searchTab";

export default function SearchWrapper({
	posts,
	users,
}: {
	posts: PostsWithLikesResult;
	users: UsersWithFollowingResult;
}) {
	const currentTab = useSearchTabStore(state => state.currentTab);

	switch (currentTab) {
		case SearchTabEnum.Posts:
			return <PostList posts={posts} />;
		case SearchTabEnum.Users:
			return <UserList users={users} />;
	}
}
