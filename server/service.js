const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
	'https://www.googleapis.com/auth/drive'];

async function getAuthToken() {
	const auth = new google.auth.GoogleAuth({
		scopes: SCOPES
	});
	const authToken = await auth.getClient();
	return authToken;
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

	const res = await sheets.spreadsheets.create({
		auth,
		resource,
		fields: 'spreadsheetId'
	});

	const drive = google.drive({
		version: 'v3',
		auth
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


module.exports = {
	getAuthToken,
	getSpreadSheet,
	getSpreadSheetValues,
	createTable,
	createDatabase
}