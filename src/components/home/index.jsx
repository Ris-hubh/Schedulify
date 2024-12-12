import React from 'react'
import { useAuth } from '../../contexts/authContext'
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };
    const handleCalenderClick = () => {
        navigate('/calender');
    };
    return (
        <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            <button
                onClick={handleProfileClick}
                className='mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600'
            >
                Go to Profile
            </button>
            <button
                onClick={handleCalenderClick}
                className='mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600'
            >
                Go to Calender
            </button>
        </div>
    )
}

export default Home