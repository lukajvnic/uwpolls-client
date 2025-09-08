import './Navbar.css';
import Create from './Create';
import React from 'react';


function Navbar() {
    const randomPoll = async () => {
        console.log("Navigate to Random Poll");
    }

    const [creating, setCreating] = React.useState(false);

    return (
        <nav>
            <div className="create-container">
                {creating && <Create toggleCreate={() => {
                    setCreating(false);
                }} />}
            </div>

            <div className="brand">
                <div className="logo-container">
                    <img id="logo" src="/uwpolls-logo.jpg" alt="Logo" />
                </div>
                <div className="brand-name">
                    uwpolls
                </div>
            </div>
            <div className="nav-options">
                <div className="nav-option" onClick={randomPoll}>
                    Random
                </div>
                <div id="create-poll" className="nav-option" onClick={() => setCreating(true)}>
                    Create Poll
                </div>
                <div className="profile">
                    <img id="profile-image" src="/profile.svg" alt="Profile" />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
