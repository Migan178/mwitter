import Image from "next/image";

export default function UserProfile({
	profile,
	size = 70,
}: {
	profile: string;
	size?: number;
}) {
	return (
		<Image
			src={profile}
			alt="유저의 프로필"
			width={size}
			height={size}
			className="rounded-full"
			unoptimized
		/>
	);
}
