import ProfileEdit from "@/components/profiles/ProfileEdit";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/services/user";

export default async function ProfileEditModal() {
	const session = await auth();

	if (!session) {
		return <h1>로그인 되어있지 않은 사용자</h1>;
	}

	const user = await getUserById(Number(session.user?.id));

	return (
		<div className="fixed h-full w-full top-0 left-0 flex justify-center items-center bg-black/50">
			<ProfileEdit initialData={user} />
		</div>
	);
}
