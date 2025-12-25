import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default function PostCreatedAt({ createdAt }: { createdAt: Date }) {
	dayjs.extend(relativeTime);
	dayjs.locale("ko");

	return <p>{dayjs(createdAt).fromNow()}</p>;
}
