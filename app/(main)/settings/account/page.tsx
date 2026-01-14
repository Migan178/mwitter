import Link from "next/link";

export default function AccountSettingsPage() {
	return (
		<div>
			<div>
				<Link href="/settings/account/edit">계정 정보 수정</Link>
			</div>
			<div>
				<Link href="/settings/account/protected">계정 공개 설정</Link>
			</div>
		</div>
	);
}
