"use client";

import { type MouseEventHandler } from "react";

export default function DeclineButton({
	onClick,
}: {
	onClick: MouseEventHandler<HTMLButtonElement>;
}) {
	return <button onClick={onClick}>거절</button>;
}
