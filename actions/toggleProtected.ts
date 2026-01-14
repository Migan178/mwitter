"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleProtected(initialState: any, isProtected: boolean) {
	const session = await auth();
	if (!session || !session.user) return false;

	try {
		await prisma.user.update({
			where: {
				id: Number(session.user.id),
			},
			data: {
				protected: !isProtected,
			},
		});
	} catch (err) {
		console.error(err);
		return false;
	}

	return true;
}
