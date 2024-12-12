import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { docreateUserWithEmailAndPassword } from '../../../firebase/auth';
import styles from './Register.module.css';

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();

    const validateInput = () => {
        if (!email.endsWith('@gmail.com')) {
            setErrorMessage('Invalid email. Email must end with @gmail.com');
            return false;
        }
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering && validateInput()) {
            setIsRegistering(true);
            try {
                await docreateUserWithEmailAndPassword(email, password);
                navigate('/home');
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsRegistering(false);
            }
        }
    };

    return (
        <>
            {userLoggedIn && <Navigate to="/home" replace={true} />}

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>Create a New Account</h3>
                    </div>
                    <form onSubmit={onSubmit} className={styles.form}>
                        <div>
                            <label className={styles.label}>Email</label>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isRegistering}
                                className={styles.input}
                            />
                        </div>

                        <div>
                            <label className={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                autoComplete="off"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isRegistering}
                                className={styles.input}
                            />
                        </div>

                        {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`${styles.submitButton} ${
                                isRegistering ? styles.submitButtonDisabled : styles.submitButtonEnabled
                            }`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account?{' '}
                            <Link to="/login" className={styles.loginLink}>
                                Continue
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;
