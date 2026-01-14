import EditProfileButton from "@/components/users/EditProfileButton";
import Link from "next/link";

export default function SettingsPage() {
	return (
		<div>
			<div>
				<EditProfileButton />
			</div>
			<div>
				<Link href="/settings/account">계정</Link>
			</div>
		</div>
	);
}
