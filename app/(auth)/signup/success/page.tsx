"use client";

export default function SuccessPage() {
	return (
		<div className="grid h-screen items-center justify-center">
			<div>
				<h1 className="text-3xl font-bold">회원가입 성공</h1>
				<button
					onClick={() => (window.location.href = "/")}
					className="hover:cursor-pointer"
				>
					메인 페이지로 이동
				</button>
			</div>
		</div>
	);
}
