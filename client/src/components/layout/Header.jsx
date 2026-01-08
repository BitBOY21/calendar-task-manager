import React from 'react';

// קומפוננטת הכותרת העליונה - מקבלת את אובייקט המשתמש ופונקציית התנתקות
const Header = ({ user, onLogout }) => {
    return (
        // המעטפת הראשית (Header) - משתמשת ב-Flexbox כדי לפזר את התוכן לצדדים
        <header style={styles.header}>
            {/* צד שמאל: הלוגו והשם של האפליקציה */}
            <h1 style={styles.logo}>Smart Tasker 🚀</h1>

            {/* צד ימין: אזור המשתמש - מוצג רק אם המשתמש מחובר (user קיים) */}
            {user && (
                <div style={styles.userSection}>
                    {/* טקסט ברכה למשתמש */}
                    <span style={styles.welcome}>Hello, User 👋</span>
                    
                    {/* כפתור התנתקות - מפעיל את הפונקציה onLogout שהגיעה מה-App */}
                    <button onClick={onLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

// אובייקט העיצוב (Inline Styles) - כאן מוגדרים כל חוקי ה-CSS של הקומפוננטה
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between', // דוחף את הלוגו שמאלה ואת המשתמש ימינה
        alignItems: 'center',
        marginBottom: '30px',
        maxWidth: '1200px', // מגביל את רוחב הכותרת כדי שלא תהיה רחבה מדי במסכים גדולים
        margin: '0 auto 30px auto', // ממרכז את הכותרת באמצע המסך
        padding: '10px 0'
    },
    logo: {
        margin: 0,
        color: '#333',
        fontSize: '1.8rem'
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px' // יוצר מרווח בין הטקסט לכפתור
    },
    welcome: {
        fontSize: '1rem',
        color: '#555',
        fontWeight: '500'
    },
    logoutBtn: {
        backgroundColor: '#dc3545', // צבע אדום (Danger)
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.2s'
    }
};

export default Header;