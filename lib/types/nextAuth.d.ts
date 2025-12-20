import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
	interface User {
		handle: string;
		id: string;
		email: string;
		name: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		handle: string;
		id: string;
		email: string;
		name: string;
	}
}
