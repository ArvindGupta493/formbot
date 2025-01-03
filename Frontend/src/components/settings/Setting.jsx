import { useState } from 'react';
import styles from './Setting.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Setting = () => {
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('formId');
        localStorage.removeItem('folderId');
        alert('Logged out successfully!');
        navigate('/login');
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                '/api/user/update-password',
                { name, email, oldPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUpdateMessage(response.data.message || 'Password updated successfully!');
        } catch {
            setUpdateMessage('Error updating password. Please check your credentials and try again.');
        }
    };
    

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settings}>
                <h1 className={styles.title}>Settings</h1>
                <form className={styles.settingsForm} onSubmit={handleUpdatePassword}>
                    <div className={styles.inputWrapper}>
                        <i className={`fas fa-user ${styles.icon}`}></i>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <i className={`fas fa-envelope ${styles.icon}`}></i>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <i className={`fas fa-lock ${styles.icon}`}></i>
                        <input
                            className={styles.input}
                            type={showOldPassword ? 'text' : 'password'}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <i
                            className={`fas fa-eye ${styles.toggleIcon}`}
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        ></i>
                    </div>

                    <div className={styles.inputWrapper}>
                        <i className={`fas fa-lock ${styles.icon}`}></i>
                        <input
                            className={styles.input}
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <i
                            className={`fas fa-eye ${styles.toggleIcon}`}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        ></i>
                    </div>

                    <button className={styles.updateButton} type="submit">
                        Update Password
                    </button>
                </form>
                <div>{updateMessage}</div>
            </div>

            <div className={styles.logout}>
                <button className={styles.logoutBtn} onClick={logout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                </button>
            </div>
        </div>
    );
};

export default Setting;
