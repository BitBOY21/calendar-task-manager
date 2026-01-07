import React from 'react';
import Card from '../components/ui/Card'; // Import Card component
import { buttonPrimary, colors, gradientText } from '../components/ui/DesignSystem';

const SettingsPage = ({ user }) => {
    const userName = user?.name || 'User';

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>
                    <span className="text-gradient">Settings</span> ⚙️
                </h1>
                <p style={styles.subtitle}>Manage your account and preferences</p>
            </div>

            <Card style={{ marginBottom: '24px' }}>
                <h3 style={styles.sectionTitle}>👤 Profile</h3>
                <div style={styles.row}>
                    <label style={styles.label}>Name</label>
                    <input type="text" value={userName} disabled style={styles.input} />
                </div>
                <div style={styles.row}>
                    <label style={styles.label}>Email</label>
                    <input type="email" value="user@example.com" disabled style={styles.input} />
                </div>
                <button style={{...buttonPrimary, marginTop: '20px'}}>Update Profile</button>
            </Card>

            <Card style={{ marginBottom: '24px' }}>
                <h3 style={styles.sectionTitle}>🔔 Notifications</h3>
                <div style={styles.checkboxRow}>
                    <input type="checkbox" id="emailNotif" defaultChecked style={styles.checkbox} />
                    <label htmlFor="emailNotif" style={styles.checkboxLabel}>Email Notifications</label>
                </div>
                <div style={styles.checkboxRow}>
                    <input type="checkbox" id="pushNotif" style={styles.checkbox} />
                    <label htmlFor="pushNotif" style={styles.checkboxLabel}>Push Notifications</label>
                </div>
            </Card>

            <Card>
                <h3 style={styles.sectionTitle}>🎨 Appearance</h3>
                <div style={styles.row}>
                    <label style={styles.label}>Theme</label>
                    <select style={styles.select}>
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                    </select>
                </div>
            </Card>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        // Removed background color to let global gradient show through
        height: '100%',
        overflowY: 'auto'
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    subtitle: {
        color: colors.textSecondary,
        fontSize: '1.1rem',
        fontWeight: '400'
    },
    sectionTitle: {
        fontSize: '1.2rem',
        color: colors.textPrimary,
        fontWeight: '700',
        marginBottom: '20px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '10px'
    },
    row: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: colors.textSecondary,
        fontSize: '0.9rem'
    },
    input: {
        width: '100%',
        maxWidth: '600px', // Added max-width
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        fontSize: '1rem',
        backgroundColor: '#f9f9f9',
        color: '#555'
    },
    select: {
        width: '100%',
        maxWidth: '600px', // Added max-width
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        fontSize: '1rem',
        backgroundColor: 'white'
    },
    checkboxRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px'
    },
    checkbox: {
        marginRight: '10px',
        width: '18px',
        height: '18px'
    },
    checkboxLabel: {
        fontSize: '1rem',
        color: colors.textPrimary
    }
};

export default SettingsPage;