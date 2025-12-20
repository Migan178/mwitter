"use client";

import PostList from "./PostList";
import { type PostsWithLikesResult } from "@/lib/services/post";
import usePostTabStore, { PostTabEnum } from "@/stores/postTab";

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
