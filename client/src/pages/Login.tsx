import { useEffect } from "react";
import "../css/login.css";
import { useGoogleLogin } from "@react-oauth/google";
import LoginCards from "../components/Login/LoginCards";
import LoginWithGoogle from "../components/Login/LoginWithGoogleBtn";
import { LoginCardsInfo } from "../data/LoginCards";
import axios from "axios";
import { useIndexContext } from "../context/Context";
import { Button } from "../components/ui/button";
import { useCookies } from "react-cookie";

function LoginPage() {
	const { user, setUser, profile, setProfile } = useIndexContext();
	const [cookies, setCookie, removeCookie] = useCookies(["loggedInUser"]);

	useEffect(() => {
		if (cookies.loggedInUser) {
			setUser(cookies.loggedInUser);
		} else {
			setUser(null);
		}
	}, [cookies, setUser, setCookie]);

	const login = useGoogleLogin({
		onSuccess: async (tokenResponse: any) => {
			setCookie("loggedInUser", tokenResponse, { path: "/" });
			setUser(tokenResponse);
		},
		onError: (error) => {
			console.log(error);
		},
		scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets",
		prompt: "consent",
	});

	useEffect(() => {
		if (user) {
			axios
				.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${user.access_token}`,
							Accept: "application/json",
						},
					}
				)
				.then((res) => {
					setProfile(res.data);
				})
				.catch((err) => {
					console.log(err);
					removeCookie("loggedInUser");
					setUser(null);
				});
		}
	}, [user, setProfile, setUser, removeCookie]);

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
			{LoginCardsInfo.map((card, index) => {
				return (
					<LoginCards
						key={index}
						heading={card.heading}
						content={card.content}
						area={card.area}
					/>
				);
			})}
			<div
				className="card5 grid place-items-center dark"
				style={{ gridArea: "login" }}
			>
				{!user && (
					<div
						className="w-fit h-fit rounded-md"
						onClick={() => login()}
					>
						<LoginWithGoogle />
					</div>
				)}
				{user && profile && (
					<div className="w-fit h-fit rounded-md flex flex-col items-center justify-evenly gap-2">
						<h1 className="text-2xl font-nature-beauty tracking-wide leading-[3.5rem] text-center text-slate-300">
							Welcome <br />
							<span className="text-3xl">{profile.name}</span>
						</h1>
						<Button
							variant="outline"
							className="bg-transparent border-2 border-white/30 duration-150"
							onClick={() => {
								window.location.href = "/Dashboard";
							}}
						>
							Get Started
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

export default LoginPage;
