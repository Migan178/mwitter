"use client";

import { type PostsWithLikesResult } from "@/lib/services/post";
import usePostTabStore, { PostTabEnum } from "@/stores/postTab";
import PostList from "./PostList";

export default function PostsWrapper({
	allPosts,
	followingPosts,
}: {
	allPosts: PostsWithLikesResult;
	followingPosts: PostsWithLikesResult;
}) {
	const currentTab = usePostTabStore(state => state.currentTab);
	const posts = currentTab === PostTabEnum.All ? allPosts : followingPosts;

	return <PostList posts={posts} />;
}
