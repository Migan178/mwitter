import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
}

export function checkPassword(password: string, hashedPassword: string) {
	return bcrypt.compare(password, hashedPassword);
}
