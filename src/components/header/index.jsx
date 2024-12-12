import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';

const Header = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    // Header styling for bottom navigation
    const headerStyle = {
        display: 'flex',
        justifyContent: 'center', // Center the links horizontally
        alignItems: 'center',
        padding: '1rem',
        width: '100%',
        position: 'fixed',
        bottom: 0, // Position at the bottom
        left: 0,
        height: '4rem', // Increase height for better spacing
        backgroundColor: '#1e1e2f', // Darker background for contrast
        zIndex: 20, // Ensure it stays on top of other elements
       
    };

    // Button/link styling
    const buttonLinkStyle = {
        fontSize: '1rem',
        color: '#fff', // White text for contrast
        textDecoration: 'none',
        padding: '0.5rem 1.5rem', // Extra padding for buttons
        margin: '0 0.5rem', // Space between links/buttons
        borderRadius: '20px', // Rounded buttons for a modern look
        border: '1px solid #7289da', // Add border with color for style
        backgroundColor: '#5865f2', // Default button color
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth hover effect
    };

    // Hover effect
    const buttonHoverStyle = {
        backgroundColor: '#ff7f50', // Darker shade on hover
        color: '#d1d5db', // Lighten text color on hover
    };

    return (
        <nav style={headerStyle}>
            {userLoggedIn ? (
                <button
                    onClick={() => {
                        doSignOut().then(() => {
                            navigate('/login');
                        });
                    }}
                    style={buttonLinkStyle}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#5865f2')}
                >
                    Logout
                </button>
            ) : (
                <>
                    <Link
                        style={buttonLinkStyle}
                        to="/login"
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                            e.target.style.color = buttonHoverStyle.color;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#5865f2';
                            e.target.style.color = '#fff';
                        }}
                    >
                        Login
                    </Link>
                    <Link
                        style={buttonLinkStyle}
                        to="/register"
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                            e.target.style.color = buttonHoverStyle.color;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#5865f2';
                            e.target.style.color = '#fff';
                        }}
                    >
                        Register New Account
                    </Link>
                </>
            )}
        </nav>
    );
};

export default Header;
