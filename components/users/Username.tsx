export default function Username({
	name,
	handle,
}: {
	name: string;
	handle: string;
}) {
	return (
		<div className="flex gap-x-1">
			<h1>{name}</h1>
			<h2>@{handle}</h2>
		</div>
	);
}
