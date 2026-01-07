import { useState } from 'react';
import { authService } from '../../services/authService';
import { glassCard, buttonPrimary, inputStyle, gradientText } from '../../components/ui/DesignSystem';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🖱️ UI: Submit Clicked');
        setError('');

        try {
            let data;
            if (isRegistering) {
                console.log('🔵 UI: Calling Register...');
                data = await authService.register(username, email, password);
            } else {
                console.log('🔵 UI: Calling Login...');
                data = await authService.login(email, password);
            }
            console.log('✅ UI: Auth Success, Data:', data);
            
            // Pass the FULL data object
            onLogin(data);
        } catch (err) {
            console.error('❌ UI: Auth Failed', err);
            const msg = err.response?.data?.message || 'Something went wrong';
            const details = err.response?.data?.errors ? ` (${err.response.data.errors.join(', ')})` : '';
            setError(msg + details);
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h2 style={styles.title}>
                    {isRegistering ? 'Create Account 🚀' : 'Welcome Back 👋'}
                </h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {isRegistering && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>
                        {isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.switchText}
                   onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering
                        ? 'Already have an account? Login'
                        : 'Need an account? Register'}
                </p>
            </div>
        </div>
    );
};

const styles = {
    background: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
    },
    container: {
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        padding: '48px 40px',
        ...glassCard,
        borderRadius: '24px'
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '32px',
        ...gradientText
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '20px'
    },
    input: {
        ...inputStyle,
        padding: '16px 20px'
    },
    button: {
        ...buttonPrimary,
        marginTop: '8px'
    },
    error: {
        color: '#d32f2f',
        marginBottom: '16px',
        background: 'rgba(211, 47, 47, 0.1)',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '0.9rem'
    },
    switchText: {
        marginTop: '24px',
        cursor: 'pointer',
        color: '#007bff',
        fontSize: '0.95rem',
        fontWeight: '500',
        transition: 'color 0.2s ease'
    }
};

export default Login;