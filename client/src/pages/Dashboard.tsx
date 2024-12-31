import { useEffect } from "react";
import { useIndexContext } from "../context/Context";

function Dashboard() {
	const { profile } = useIndexContext();
	useEffect(() => {
		console.log(profile);
	}, [profile]);
	return <div>{profile?.email}</div>;
}

export default Dashboard;
