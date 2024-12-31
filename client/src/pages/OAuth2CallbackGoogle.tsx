import React, { useEffect } from "react";
import { useIndexContext } from "../context/Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { getCookie } from "../lib/handler";

function OAuth2CallbackGoogle() {
	const { user, setUser, profile, setProfile, server_url } =
		useIndexContext();
	const navigate = useNavigate();

	useEffect(() => {
		axios.defaults.baseURL = server_url;
	}, [server_url]);

	useEffect(() => {
		const getProfile = async () => {
			const response = await getCookie("callbackresponse");
			const json = JSON.parse(response.value);
			setProfile(json.profile);
		};

		getProfile();
	}, [setProfile]);

	return <></>;
}

export default OAuth2CallbackGoogle;
