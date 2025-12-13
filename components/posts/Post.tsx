import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

export default function Post({
	user,
	content,
	createdAt,
	id,
}: {
	user: string;
	content: string;
	createdAt: Date;
	id: number;
}) {
	dayjs.extend(relativeTime);
	dayjs.locale("ko");

	return (
		<li key={id}>
			<div>
				<h1>{user}</h1>
				<h2>{content}</h2>
				<p>{dayjs(createdAt).fromNow()}</p>
			</div>
		</li>
	);
}
