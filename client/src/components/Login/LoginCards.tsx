import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import "../../css/login.css";

function LoginCards({ heading, content, area }) {
	return (
		<Card
			className="facts-card w-full h-full rounded-md bg-background/60  text-foreground flex flex-col justify-evenly p-4"
			style={{
				gridArea: area,
			}}
		>
			<CardHeader>
				<CardTitle className="text-center font-bold">
					{heading}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-center">{content}</p>
			</CardContent>
		</Card>
	);
}

export default LoginCards;
