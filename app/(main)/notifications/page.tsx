import NotificationList from "@/components/notifications/NotificationList";
import { auth } from "@/lib/auth";
import { getNotificationsByRecipientId } from "@/lib/services/notification";

export default async function NotificationPage() {
	const session = await auth();
	if (!session) return <h1>로그인 하세요</h1>;

	try {
		const notifications = await getNotificationsByRecipientId(
			Number(session.user?.id),
		);

		return (
			<div>
				<NotificationList notifications={notifications} />
			</div>
		);
	} catch (err) {
		console.log(err);
		return <h1>오류 발생.</h1>;
	}
}
