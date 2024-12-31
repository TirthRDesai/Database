const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', "https://www.googleapis.com/auth/userinfo.profile"];

async function getNewClient() {
	const oauth2Client = new google.auth.OAuth2(
		process.env.OAUTH_CLIENT_ID,
		process.env.OAUTH_CLIENT_SECRET,
		process.env.OAUTH_REDIRECT_URL
	);
	return oauth2Client;
}

async function getAuthToken() {
	const oauth2Client = await getNewClient();
	const authToken = await oauth2Client.getAccessToken();
	return authToken;
}

async function setAuthToken(token) {
	const oauth2Client = await getNewClient();
	oauth2Client.setCredentials(token);
}

async function getSpreadSheet({ spreadsheetId, auth }) {
	const res = await sheets.spreadsheets.get({
		spreadsheetId,
		auth,
	});
	return res;
}

async function getSpreadSheetValues({ spreadsheetId, auth, sheetName }) {
	const res = await sheets.spreadsheets.values.get({
		spreadsheetId,
		auth,
		range: sheetName
	});
	return res;
}

async function createTable({ spreadsheetId, auth, sheetName }) {
	console.log(sheetName);
	const res = await sheets.spreadsheets.batchUpdate({
		spreadsheetId,
		auth,
		requestBody: {
			requests: [
				{
					addSheet: {
						properties: {
							title: sheetName
						}
					}
				}
			]
		}
	});
	return res;
}

async function createDatabase({ auth, title, owner }) {
	const resource = {
		properties: {
			title
		}
	};

	const res = sheets.spreadsheets.create({
		auth,
		resource,
		fields: 'spreadsheetId'
	});



	const resPermission = await drive.permissions.create({
		fileId: res.data.spreadsheetId,
		requestBody: {
			role: 'writer',
			type: 'user',
			emailAddress: owner
		}
	});

	res.data.permission = resPermission.data;
	return res;
}

async function getAuthUrl(userId) {
	const oauth2Client = await getNewClient();
	const url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
		include_granted_scopes: true,
		state: userId,
		prompt: 'consent',
		redirect_uri: process.env.OAUTH_REDIRECT_URL
	});
	return url;
}

async function getTokens(authCode) {
	try {
		const oauth2Client = await getNewClient();
		const { tokens } = await oauth2Client.getToken(authCode);
		return tokens;
	} catch (error) {
		console.error('Error exchanging authorization code:', error);
	}
}


module.exports = {
	getAuthToken,
	getSpreadSheet,
	getSpreadSheetValues,
	createTable,
	createDatabase,
	getAuthUrl,
	getTokens,
}