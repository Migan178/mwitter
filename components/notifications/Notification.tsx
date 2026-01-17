"use client";

import Post from "../posts/Post";
import UserListItem from "../users/UserListItem";
import UserProfile from "../users/UserProfile";
import { NotificationType } from "@/app/generated/prisma/enums";
import { PostResult } from "@/lib/services/post";
import { UserResult } from "@/lib/services/user";
import Link from "next/link";
import { HeartFill, PersonPlusFill, Repeat } from "react-bootstrap-icons";

export default function Notification({
	notification: { type, post, isRead, sender },
}: {
	notification: {
		type: NotificationType;
		post: PostResult | null;
		isRead: boolean;
		sender: UserResult;
	};
}) {
	return (
		<div className="w-full">
			{isRead ? <p>(읽음)</p> : null}
			<div
				className={type === "MENTION" || type === "REPLY" ? "" : "p-2"}
			>
				{type === "LIKE" ? (
					<div className="relative">
						<div className="flex gap-x-3.75">
							<HeartFill
								size={25}
								className="text-pink-500 mt-2 ml-2"
							/>
							<div>
								<div className="relative z-10 w-fit h-fit">
									<Link
										href={`/${encodeURIComponent(sender.handle)}`}
										className="hover:brightness-80 duration-200"
									>
										<UserProfile
											profile={sender.profile}
											size={40}
										/>
									</Link>
								</div>
								<p>
									<span className="relative z-10 font-semibold hover:underline">
										<Link
											href={`/${encodeURIComponent(sender.handle)}`}
										>
											{sender.name}
										</Link>
									</span>
									님이 당신의 게시물을 좋아합니다.
								</p>
								<p className="text-gray-500">{post?.content}</p>
							</div>
						</div>
						<Link
							href={`/${encodeURIComponent(post!.author.handle)}/posts/${post?.id}`}
							className="absolute z-1 w-full h-full top-0 left-0"
						/>
					</div>
				) : null}
				{type === "FOLLOW" ? (
					<div className="flex gap-x-2">
						<PersonPlusFill
							size={30}
							className="text-blue-500 mt-2 ml-2"
						/>
						<div>
							<div className="w-fit h-fit">
								<Link
									href={`/${sender.handle}`}
									className="hover:brightness-80 duration-200"
								>
									<UserProfile
										profile={sender.profile}
										size={40}
									/>
								</Link>
							</div>
							<p>
								<span className="relative z-10 font-semibold hover:underline">
									<Link
										href={`/${encodeURIComponent(sender.handle)}`}
									>
										{sender.name}
									</Link>
								</span>
								님이 당신을 팔로우 합니다.
							</p>
							<div className="border border-gray-300 px-6 py-2 w-80 h-20">
								<UserListItem user={sender} />
							</div>
						</div>
					</div>
				) : null}
				{type === "MENTION" || type === "REPLY" ? (
					<Post post={post!} />
				) : null}
				{type === "REPOST" ? (
					<div className="relative">
						<div className="flex gap-x-3.75">
							<Repeat
								size={25}
								className="mt-2 ml-2 text-green-500"
							/>
							<div>
								<div className="relative z-10 w-fit h-fit">
									<Link
										href={`/${encodeURIComponent(sender.handle)}`}
										className="hover:brightness-80 duration-200"
									>
										<UserProfile
											profile={sender.profile}
											size={40}
										/>
									</Link>
								</div>
								<p>
									<span className="relative z-10 font-semibold hover:underline">
										<Link
											href={`/${encodeURIComponent(sender.handle)}`}
										>
											{sender.name}
										</Link>
									</span>
									님이 당신의 게시물을 재게시 했습니다.
								</p>
								<p className="text-gray-500">{post?.content}</p>
							</div>
						</div>
						<Link
							href={`/${encodeURIComponent(post!.author.handle)}/posts/${post?.id}`}
							className="absolute w-full h-full z-1 top-0 left-0"
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}
