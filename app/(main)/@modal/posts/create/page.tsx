import Modal from "@/components/Modal";
import CreatePost from "@/components/posts/CreatePost";
import { auth } from "@/lib/auth";

export default async function CreatePostPage() {
	const session = await auth();

	if (!session) {
		return <h1>로그인 되어있지 않은 사용자</h1>;
	}

	return (
		<Modal>
			<CreatePost />
		</Modal>
	);
}
