import { checkPassword } from "@/lib/hash";
import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "이메일", type: "text" },
				password: { label: "비밀번호", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials.email || !credentials.password) return null;

				try {
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email as string,
						},
					});

					if (!user) return null;

					const isPasswordValid = await checkPassword(
						credentials.password as string,
						user.hashedPassword,
					);
					if (!isPasswordValid) return null;

					return {
						id: user.id.toString(),
						name: user.name,
						email: user.email,
						handle: user.handle,
						profile: user.profile,
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.handle = user.handle;
				token.profile = user.profile;
			}
			return token;
		},
		session({ token, session }) {
			session.user.id = token.id;
			session.user.handle = token.handle;
			session.user.profile = token.profile;
			return session;
		},
	},
});
