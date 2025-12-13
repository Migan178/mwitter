export default function Username({
	name,
	handle,
}: {
	name: string;
	handle: string;
}) {
	return (
		<div className="flex">
			<h1 className="mr-1">{name}</h1>
			<h2>@{handle}</h2>
		</div>
	);
}
