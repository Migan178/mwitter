export default function Username({
	name,
	handle,
}: {
	name: string;
	handle: string;
}) {
	return (
		<div className="flex gap-x-1">
			<h1 className="font-semibold">{name}</h1>
			<h2 className="text-gray-500">@{handle}</h2>
		</div>
	);
}
