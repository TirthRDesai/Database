export type GoogleAccountProfile = {
	email: string;
	familyName: string;
	givenName: string;
	id: string;
	picture: string;
	name: string;
	verified_email: boolean;
};

export type UserType = {
	access_token: string;
	authuser: string;
	expires_in: number;
	prompt: "consent" | "none" | "select_account";
	scope: string;
	token_type: string;
};

export type TokenType = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
};
