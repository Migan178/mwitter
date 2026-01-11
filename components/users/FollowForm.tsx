import { toggleFollow } from "@/actions/toggleFollow";
import Form from "next/form";

export default function FollowForm({
	children,
	userId,
}: {
	children: React.ReactNode;
	userId: number;
}) {
	return (
		<Form action={toggleFollow}>
			<input type="hidden" value={userId} name="userId" />
			{children}
		</Form>
	);
}
