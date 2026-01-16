import Separator from "../Separator";
import Notification from "./Notification";
import { type NotificationResult } from "@/lib/services/notification";

export default function NotificationList({
	notifications,
}: {
	notifications: NotificationResult[];
}) {
	if (notifications.length < 0) return <h1>알림 없음</h1>;

	return (
		<div className="w-full gray-border">
			<ul>
				{notifications.map((notification, i) => (
					<li key={notification.id}>
						<Notification notification={notification} />
						{i < notifications.length - 1 ? <Separator /> : null}
					</li>
				))}
			</ul>
		</div>
	);
}
