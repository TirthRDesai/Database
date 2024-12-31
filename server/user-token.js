const { google } = require('googleapis');
const Helper = require('./Helper');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file'];


const getServiceAuthToken = async () => {
    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    const authToken = await auth.getClient();
    return authToken;
}

const getUserTokenDB = async ({ auth }) => {
    const spreadsheetId = "1xX2vIjMRpIlZ6VMoBjPPcc5jOtPXpHITYTjB7Nx0XK4"

    const res = await sheets.spreadsheets.get({
        spreadsheetId,
        auth,
    });
    return res;
}

const getUserTokenSheet = async ({ auth }) => {
    const spreadsheetId = "1xX2vIjMRpIlZ6VMoBjPPcc5jOtPXpHITYTjB7Nx0XK4"
    const sheetName = "Sheet1"

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: sheetName
    });
    return res;
}

const addToken = async (auth, token, userID) => {
    const spreadsheetId = "1xX2vIjMRpIlZ6VMoBjPPcc5jOtPXpHITYTjB7Nx0XK4"
    const sheetName = "Sheet1"

    const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        auth,
        range: sheetName,
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[userID, Helper.encrypt(token.access_token), Helper.encrypt(token.refresh_token), token.expiry_date]]
        }
    }).then((accepted) => {
        return {
            status: "Success",
            message: "Token added successfully",
            data: accepted
        };
    }, (rejection) => {
        return {
            status: "Failed",
            message: "Token add failed",
            data: rejection
        };
    }).catch((error) => {
        return {
            status: "Error",
            message: error,
            data: null
        };
    });
    return res;
}

const findUser = async (auth, userID) => {
    console.log(userID)
    const spreadsheetId = "1xX2vIjMRpIlZ6VMoBjPPcc5jOtPXpHITYTjB7Nx0XK4"
    const sheetName = "Sheet1"

    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: sheetName
    });

    const rows = res.data.values;
    const user = rows.find(row => row[0] === userID);
    if (!user) {
        return null;
    }
    const output = {
        user_id: user[0],
        access_token: user[1],
        refresh_token: user[2],
        expiry_date: user[3]
    }
    return output;
}

const replace_tokens = async (auth, token, userID) => {
    console.log(userID)
    const spreadsheetId = "1xX2vIjMRpIlZ6VMoBjPPcc5jOtPXpHITYTjB7Nx0XK4"

    const getResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: 'Sheet1',
    });
    const rows = getResponse.data.values;

    const rowsToReplace = rows.reduce((acc, row, index) => {
        if (row[0] === userID) {
            acc.push(index + 1);
        }
        return acc;
    }, []);

    const replacementData = [
        [userID, Helper.encrypt(token.access_token), Helper.encrypt(token.refresh_token), token.expiry_date]
    ];

    let output;
    for (const rowIndex of rowsToReplace) {
        const rangeToUpdate = `Sheet1!A${rowIndex}:D${rowIndex}`;
        const requestBody = {
            values: [replacementData[rowsToReplace.indexOf(rowIndex)]],
        };
        output = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: rangeToUpdate,
            valueInputOption: 'USER_ENTERED',
            auth,
            resource: requestBody,
        }).then((accepted) => {
            return {
                status: "Success",
                message: "Token updated successfully",
                data: accepted
            };
        }, (rejection) => {
            return {
                status: "Failed",
                message: "Token update failed",
                data: rejection
            };
        }).catch((error) => {
            return {
                status: "Error",
                message: error,
                data: null
            };
        });
    }

    return output;
}

module.exports = {
    getServiceAuthToken,
    getUserTokenDB,
    getUserTokenSheet,
    addToken,
    findUser,
    replace_tokens
}

