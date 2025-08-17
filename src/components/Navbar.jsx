import './Navbar.css';

function Navbar() {
  return (
    <nav>
        <div className="brand">
            <div className="logo-container">
                <img id="logo" src="/uwpolls-logo.jpg" alt="Logo" />
            </div>
            <div className="brand-name">
                uwpolls
            </div>
        </div>
        <div className="nav-options">
            <div className="nav-option">
                Random
            </div>
            <div id="create-poll" className="nav-option">
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
