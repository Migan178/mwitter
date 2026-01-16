export default function ToastAlert({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="fixed w-fit h-fit right-1/2 bottom-4 translate-x-1/2 bg-blue-500 py-4 px-5 rounded-full">
			<h1 className="text-white">{children}</h1>
		</div>
	);
}
