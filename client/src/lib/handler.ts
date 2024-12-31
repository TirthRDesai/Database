import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

export const getCookie = async (name: string) => {
	const response = await axios.get(`/api/manager/cookies?name=${name}`, {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": "true",
		},
		withCredentials: true,
	});

	return response.data;
};
