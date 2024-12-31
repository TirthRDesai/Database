import { useEffect, useId, useState } from "react";
import "../css/login.css";
import LoginCards from "../components/Login/LoginCards";
import LoginWithGoogle from "../components/Login/LoginWithGoogleBtn";
import { LoginCardsInfo } from "../data/LoginCards";
import axios from "axios";
import { useIndexContext } from "../context/Context";
import { useCookies } from "react-cookie";
import { UserType } from "../types";

function LoginPage() {
	const { user, setUser, profile, setProfile, server_url } =
		useIndexContext();
	const [cookies, setCookie, removeCookie] = useCookies(["loggedInUser"]);

	const [authURL, setAuthURL] = useState<string>("");

	const [id, setID] = useState<string>(useId());

	useEffect(() => {
		axios.defaults.baseURL = server_url;
	}, [server_url]);

	useEffect(() => {
		if (cookies.loggedInUser) {
			setUser(cookies.loggedInUser as UserType);
		} else {
			setUser(null);
		}
	}, [cookies, setUser, setCookie]);

	const login = async () => {
		const authURLResponse = await axios.get(
			`/api/auth/getAuthURL?state=${id}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (authURLResponse.data.authURL) {
			setAuthURL(authURLResponse.data.authURL);
			window.location.href = authURLResponse.data.authURL;
		}
	};

	return (
		<div
			className="bg-background text-foreground  w-full h-screen grid p-6 overflow-hidden"
			style={{
				gridTemplateColumns: "repeat(3, 1fr)",
				gridTemplateRows: "repeat(3, 1fr)",
				gridTemplateAreas: `
                    "card1 card2 card3"
                    "card4 login card5"
                    "card6 card7 card8"
                `,
				gap: "1rem",
			}}
		>
			{LoginCardsInfo.map(
				(
					card: { heading: string; content: string; area: string },
					index: number
				) => {
					return (
						<LoginCards
							key={index}
							heading={card.heading}
							content={card.content}
							area={card.area}
						/>
					);
				}
			)}
			<div
				className="card5 grid place-items-center dark"
				style={{ gridArea: "login" }}
			>
				<div
					className="w-fit h-fit rounded-md"
					onClick={() => login()}
				>
					<LoginWithGoogle />
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
