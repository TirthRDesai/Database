async function fetchProfile(access_token) {
	const axios = require("axios");
	const profile = await axios
		.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
					Accept: "application/json",
				},
			}
		)
		.then((response) => {
			// return response.data;
			return {
				data: response.data,
				error: null,
			};
		})
		.catch((err) => {
			console.log(err);
			return {
				data: null,
				error: err,
			};
		});

	return profile;
}

module.exports = { fetchProfile };
