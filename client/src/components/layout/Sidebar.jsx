import React from 'react';
import { FaHome, FaCalendarAlt, FaChartPie, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Sidebar = ({ currentView, onChangeView, onLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Home', icon: <FaHome /> },
        { id: 'calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
        { id: 'list', label: 'My Summary', icon: <FaChartPie /> },
        { id: 'history', label: 'History', icon: <FaHistory /> },
    ];

    return (
        <div style={styles.sidebarContainer}>
            <div style={styles.sidebar}>
                <div style={styles.logoContainer}>
                    <img src={logo} alt="MasterTasker" style={styles.logoImage} />
                </div>

                <nav style={styles.nav}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            style={{
                                ...styles.navItem,
                                background: currentView === item.id 
                                    ? 'linear-gradient(135deg, rgba(0,123,255,0.1), rgba(111,66,193,0.1))' 
                                    : 'transparent',
                                backgroundColor: currentView === item.id ? '#e3f2fd' : 'transparent',
                                color: currentView === item.id ? '#007bff' : '#666',
                                fontWeight: currentView === item.id ? '600' : '500',
                                boxShadow: currentView === item.id ? '0 2px 8px rgba(0,123,255,0.15)' : 'none'
                            }}
                        >
                            <span style={styles.icon}>{item.icon}</span>
                            <span style={styles.label}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={styles.footer}>
                    <button
                        onClick={() => onChangeView('settings')}
                        style={styles.navItem}
                    >
                        <span style={styles.icon}><FaCog /></span> Settings
                    </button>

                    <button
                        onClick={onLogout}
                        style={{
                            ...styles.navItem, 
                            color: '#d32f2f', 
                            marginTop: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 47, 47, 0.1)';
                            e.currentTarget.style.color = '#b71c1c';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#d32f2f';
                        }}
                    >
                        <span style={styles.icon}><FaSignOutAlt /></span> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    sidebarContainer: {
        height: '100vh',
        padding: '20px', // Creates the 20px margin from top, bottom, and left
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100
    },
    sidebar: {
        width: '260px',
        backgroundColor: '#ffffff', // Pure white as requested
        borderRadius: '20px', // Rounded corners
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        height: '100%', // Fills the container (100vh - 40px)
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)', // Soft shadow
        border: 'none' // Removed border for cleaner floating look
    },
    logoContainer: {
        textAlign: 'center',
        marginBottom: '32px',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80px'
    },
    logoImage: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain'
    },
    nav: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px', 
        flex: 1,
        padding: '0 12px'
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '14px 20px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        width: '100%',
        color: '#666',
        borderRadius: '12px',
        fontWeight: '500'
    },
    icon: { 
        marginRight: '16px', 
        fontSize: '1.2rem', 
        display: 'flex',
        color: 'inherit'
    },
    label: { 
        fontWeight: '500' 
    },
    footer: { 
        borderTop: '1px solid #f0f0f0', // Lighter border for footer
        paddingTop: '16px',
        padding: '16px 12px 0 12px'
    }
};

export default Sidebar;