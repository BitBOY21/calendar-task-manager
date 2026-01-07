import React, { useState } from 'react';
import { authService } from '../../services/authService';
import logoImg from '../../assets/logo.png'; 
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = ({ onLogin, onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log('🖱️ UI: Register Submit Clicked');
        setError('');

        try {
            console.log('🔵 UI: Calling Register...');
            const data = await authService.register(username, email, password);
            console.log('✅ UI: Auth Success, Data:', data);
            onLogin(data);
        } catch (err) {
            console.error('❌ UI: Auth Failed', err);
            const msg = err.response?.data?.message || 'Something went wrong';
            const details = err.response?.data?.errors ? ` (${err.response.data.errors.join(', ')})` : '';
            setError(msg + details);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <img src={logoImg} alt="MasterTasker" style={styles.logo} />
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Join us and organize your tasks.</p>
                </div>

                {error && <div style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}

                <form onSubmit={handleRegister} style={styles.form}>
                    
                    {/* Full Name */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <div style={styles.inputWrapper}>
                            <FaUser style={styles.icon} />
                            <input 
                                type="text" 
                                name="name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="John Doe"
                                style={styles.input}
                                required 
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <div style={styles.inputWrapper}>
                            <FaEnvelope style={styles.icon} />
                            <input 
                                type="email" 
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="user@example.com"
                                style={styles.input}
                                required 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <FaLock style={styles.icon} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                style={styles.input}
                                required 
                            />
                            <div onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    <button type="submit" style={styles.button}>
                        Sign Up
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account? <span onClick={onSwitchToLogin} style={styles.link}>Log In</span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    logo: { height: '185px', marginBottom: '15px' },
    title: { fontSize: '1.8rem', fontWeight: '700', color: '#333', margin: '0 0 8px 0' },
    subtitle: { color: '#666', fontSize: '0.95rem', margin: 0 },
    form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.9rem', fontWeight: '600', color: '#333' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '15px', color: '#a0aec0', zIndex: 1 },
    input: {
        width: '100%', padding: '12px 15px 12px 45px', borderRadius: '10px',
        border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none',
        transition: 'all 0.2s', backgroundColor: '#f8fafc', color: '#333',
    },
    eyeIcon: { position: 'absolute', right: '15px', color: '#a0aec0', cursor: 'pointer', display: 'flex' },
    button: {
        backgroundColor: '#007bff', color: 'white', padding: '14px', borderRadius: '10px',
        border: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer',
        transition: 'background 0.2s', marginTop: '10px', boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)',
    },
    footerText: { marginTop: '25px', color: '#718096', fontSize: '0.9rem' },
    link: { color: '#007bff', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }
};

export default Register;