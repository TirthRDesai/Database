import { GoogleCredentialResponse } from "@react-oauth/google";
import { createContext, useContext, useState } from "react";
import { GoogleAccountProfile } from "../types";

type ContextType = {
	user: any;
	profile: GoogleAccountProfile | null;
	loading: boolean;
	error: string | null;

	setUser: (user: any) => void;
	setProfile: (profile: GoogleAccountProfile) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string) => void;
};

const context = createContext<ContextType>({
	user: null,
	profile: null,
	loading: true,
	error: null,

	setUser: () => {},
	setProfile: () => {},
	setLoading: () => {},
	setError: () => {},
});

function ContextProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<any>(null);
	const [profile, setProfile] = useState<GoogleAccountProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	return (
		<context.Provider
			value={{
				user,
				profile,
				loading,
				error,
				setUser,
				setProfile,
				setLoading,
				setError,
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
