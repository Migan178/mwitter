import { LockFill } from "react-bootstrap-icons";

export default function Username({
	name,
	handle,
	isProtected,
}: {
	name: string;
	handle: string;
	isProtected: boolean;
}) {
	return (
		<div className="flex gap-x-1 items-center">
			<h1 className="font-semibold">{name}</h1>
			<h2 className="text-gray-500">@{handle}</h2>
			{isProtected ? <LockFill /> : null}
		</div>
	);
}
