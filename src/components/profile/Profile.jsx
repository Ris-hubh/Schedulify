import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';  // Ensure this points to your Firebase configuration
import styles from './Profile.module.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState(currentUser.displayName || '');
    const [jobTitle, setJobTitle] = useState('');
    const [description, setDescription] = useState('');
    const [alertMessage, setAlertMessage] = useState('');  // Alert message state

    const handleSave = async () => {
        try {
            // Update the profile in Firebase
            await updateProfile(auth.currentUser, { displayName });
            // Add logic for updating jobTitle and description in Firestore or storage
            setAlertMessage('Profile updated successfully!');
        } catch (error) {
            setAlertMessage(`Error updating profile: ${error.message}`);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Edit Profile</h1>
            <div className={styles.inputContainer}>
                <label className={styles.label}>Display Name</label>
                <input
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles.inputContainer}>
                <label className={styles.label}>Job Title</label>
                <input
                    type='text'
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles.inputContainer}>
                <label className={styles.label}>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                />
            </div>
            <button
                onClick={handleSave}
                className={styles.saveButton}
            >
                Save Changes
            </button>

            {alertMessage && (
                <div className={styles.alert}>
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default Profile;
