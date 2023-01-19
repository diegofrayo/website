import { Link } from "~/components/primitive";

function Header() {
	return (
		<header className="tw-py-8">
			<Link
				variant={Link.variant.SIMPLE}
				href="/"
			>
				<h1 className="tw-text-center tw-text-3xl tw-text-yellow-800 tw-underline">diegofrayo</h1>
			</Link>
		</header>
	);
}

export default Header;
