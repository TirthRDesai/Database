const CryptoJS = require('crypto-js');
require('dotenv').config();

class Helper {
    static encrypt(data) {
        return this.CryptoJS.AES.encrypt(data, this.key).toString();
    }

    static decrypt(data) {
        return this.CryptoJS.AES.decrypt(data, this.key).toString(this.CryptoJS.enc.Utf8);
    }

    static encryptJSON(json) {
        return this.CryptoJS.AES.encrypt(JSON.stringify(json), this.key).toString();
    }

    static decryptJSON(encryptedJSON) {
        return JSON.parse(this.CryptoJS.AES.decrypt(encryptedJSON, this.key).toString(this.CryptoJS.enc.Utf8));
    }
}

Helper.CryptoJS = CryptoJS;
Helper.key = process.env.PUBLIC_ENCRYPTION_KEY;

module.exports = Helper;
