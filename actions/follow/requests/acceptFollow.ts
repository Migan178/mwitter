"use server";

import { followUser } from "../followUser";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function acceptFollow(initialState: any, followerId: number) {
	const session = await auth();
	if (!session || !session.user) return false;

	const followingId = Number(session.user.id);

	try {
		await prisma.followRequest.delete({
			where: {
				followerId_followingId: {
					followingId,
					followerId,
				},
			},
		});

		await followUser({ followerId, followingId });
	} catch (err) {
		console.error(err);
		return false;
	}

	return true;
}
