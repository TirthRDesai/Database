import { createContext, useContext, useState } from "react";
import { GoogleAccountProfile, TokenType, UserType } from "../types";

type ContextType = {
	user: UserType | null;
	profile: GoogleAccountProfile | null;
	loading: boolean;
	error: string | null;
	server_url: string | null;
	tokens: TokenType | null;

	setUser: (user: UserType | null) => void;
	setProfile: (profile: GoogleAccountProfile) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string) => void;
	setTokens: (tokens: TokenType) => void;
};

const context = createContext<ContextType>({
	user: null,
	profile: null,
	loading: true,
	error: null,
	server_url: null,
	tokens: null,

	setUser: () => {},
	setProfile: () => {},
	setLoading: () => {},
	setError: () => {},
	setTokens: () => {},
});

function ContextProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<UserType | null>(null);
	const [profile, setProfile] = useState<GoogleAccountProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const server_url = process.env.REACT_APP_SERVER_URL;
	const [tokens, setTokens] = useState<TokenType | null>(null);

	return (
		<context.Provider
			value={{
				user,
				profile,
				loading,
				error,
				server_url,
				tokens,
				setUser,
				setProfile,
				setLoading,
				setError,
				setTokens,
			}}
		>
			{children}
		</context.Provider>
	);
}

const useIndexContext = () => {
	const ctx = useContext(context);
	if (!ctx) {
		throw new Error(
			"useIndexContext must be used within a ContextProvider"
		);
	}
	return ctx;
};

export { ContextProvider, useIndexContext };
