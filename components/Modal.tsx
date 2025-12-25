export default function Modal({ children }: { children: React.ReactNode }) {
	return (
		<div className="fixed h-full w-full top-0 left-0 flex justify-center items-center bg-black/50">
			{children}
		</div>
	);
}
