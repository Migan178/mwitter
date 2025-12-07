import LoginButton from "./LoginButton";

export default function Navbar() {
	return (
		<nav className="flex justify-between">
			<h1>Mwitter</h1>
			<LoginButton />
		</nav>
	);
}
