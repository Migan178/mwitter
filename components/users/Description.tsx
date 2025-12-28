export default function Description({
	description,
}: {
	description: string | null;
}) {
	if (description)
		return (
			<div>
				<p>{description}</p>
			</div>
		);

	return null;
}
