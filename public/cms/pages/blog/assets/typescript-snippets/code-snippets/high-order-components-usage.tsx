const Dashboard = renderIf(function Dashboard() {
	return <div>Protected dashboard</div>;
})(() => isUserLoggedIn());
