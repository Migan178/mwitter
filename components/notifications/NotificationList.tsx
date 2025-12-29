import Notification from "./Notification";
import { type NotificationResult } from "@/lib/services/notification";

export default function NotificationList({
	notifications,
}: {
	notifications: NotificationResult[];
}) {
	if (notifications.length < 0) return <h1>알림 없음</h1>;

	return (
		<div>
			<ul>
				{notifications.map(notification => (
					<li key={notification.id}>
						<Notification notification={notification} />
					</li>
				))}
			</ul>
		</div>
	);
}
