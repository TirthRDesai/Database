// import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import LoginCards from './components/Login/LoginCards';

function App() {
    useEffect(() => {
        console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);
    }, [])

    return (
        <div className="bg-background text-foreground  w-full h-screen grid p-6"
            style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 1fr)",
                gridTemplateAreas: `
                    "card1 card2 card3"
                    "card4 login card5"
                    "card6 card7 card8"
                `,
                gap: "1rem"
            }}
        >
            <LoginCards heading="Open Source" content={"We provide open source and easy to use database connection system."} area="card8" />
        </div>
    );
}

export default App;
