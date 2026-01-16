"use client";

import { type MouseEventHandler } from "react";

export default function AcceptButton({
	onClick,
}: {
	onClick: MouseEventHandler<HTMLButtonElement>;
}) {
	return <button onClick={onClick}>수락</button>;
}
