import { toggleFollow } from "@/actions/toggleFollow";
import Form from "next/form";

export default function FollowForm({
	children,
	userId,
	protected: isProtected,
}: {
	children: React.ReactNode;
	userId: number;
	protected: boolean;
}) {
	return (
		<Form action={toggleFollow}>
			<input type="hidden" value={userId} name="userId" />
			<input
				type="hidden"
				value={isProtected ? "1" : "0"}
				name="protected"
			/>
			{children}
		</Form>
	);
}
