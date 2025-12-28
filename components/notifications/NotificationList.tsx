import Notification from "./Notification";
import { NotificationsResult } from "@/lib/services/notification";

export default function NotificationList({
	notifications,
}: {
	notifications: NotificationsResult;
}) {
	if (notifications.length < 0) return <h1>알림 없음</h1>;

	return (
		<div>
			<ul>
				{notifications.map(notification => (
					<li key={notification.id}>
						<Notification
							type={notification.type}
							isRead={notification.isRead}
							post={notification.post}
							sender={notification.sender}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
