import React, { useState, useEffect } from 'react';
import { FaRobot, FaLightbulb } from 'react-icons/fa';

const DailySummaryAI = ({ tasks }) => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter tasks for today
    const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    });

    useEffect(() => {
        if (todayTasks.length > 0) {
            generateSummary();
        } else {
            setSummary(["No tasks scheduled for today. Enjoy your free time! 🌴"]);
        }
    }, [tasks]); 

    const generateSummary = async () => {
        setLoading(true);
        
        // Simulate AI processing delay
        setTimeout(() => {
            const total = todayTasks.length;
            const completed = todayTasks.filter(t => t.isCompleted);
            const pending = todayTasks.filter(t => !t.isCompleted);
            const highPriority = pending.filter(t => t.priority === 'High');
            
            // 1. Overview
            let lines = [];
            
            if (completed.length === total) {
                lines.push("🏆 **All Done!** You've cleared your entire schedule for today. Amazing work!");
                setSummary(lines);
                setLoading(false);
                return;
            }

            // 2. Time Analysis
            const morningTasks = pending.filter(t => new Date(t.dueDate).getHours() < 12);
            const afternoonTasks = pending.filter(t => new Date(t.dueDate).getHours() >= 12);

            if (morningTasks.length > afternoonTasks.length) {
                lines.push(`🌅 **Busy Morning:** You have ${morningTasks.length} tasks before noon. Try to knock them out early.`);
            } else {
                lines.push(`🌇 **Afternoon Focus:** Your schedule is heavier in the afternoon. Pace yourself this morning.`);
            }

            // 3. Critical Tasks
            if (highPriority.length > 0) {
                const taskNames = highPriority.map(t => `"${t.title}"`).join(' and ');
                lines.push(`🔥 **Critical:** Your top priority right now is ${taskNames}. Don't let these slide.`);
            } else if (pending.length > 0) {
                lines.push(`✅ **Steady Flow:** No urgent fires to put out. You can work through your list calmly.`);
            }

            // 4. Context/Tags
            const workCount = pending.filter(t => t.tags.some(tag => tag.includes('Work'))).length;
            const personalCount = pending.filter(t => t.tags.some(tag => tag.includes('Personal') || tag.includes('Health'))).length;

            if (workCount > personalCount) {
                lines.push(`💼 **Work Heavy:** Today is mostly about professional goals.`);
            } else if (personalCount > 0) {
                lines.push(`🏠 **Personal Balance:** You have a good mix of personal tasks today.`);
            }

            // 5. Next Step
            if (pending.length > 0) {
                const nextTask = pending.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
                const time = new Date(nextTask.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                lines.push(`👉 **Next Up:** "${nextTask.title}" at ${time}.`);
            }

            setSummary(lines);
            setLoading(false);
        }, 1000); 
    };

    // Helper to render bold text
    const renderLine = (line, index) => {
        const parts = line.split('**');
        return (
            <p key={index} style={styles.line}>
                {parts.map((part, i) => (
                    i % 2 === 1 ? <strong key={i} style={{color: '#333'}}>{part}</strong> : part
                ))}
            </p>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <FaRobot style={{color: '#6f42c1', fontSize: '1.2rem'}} />
                <h3 style={styles.title}>AI Daily Insight</h3>
            </div>
            
            <div style={styles.content}>
                {loading ? (
                    <div style={styles.loadingState}>
                        <span className="pulse">🔮 Analyzing your day...</span>
                    </div>
                ) : (
                    <div style={styles.textContainer}>
                        {summary.map((line, i) => renderLine(line, i))}
                    </div>
                )}
            </div>
            
            {!loading && todayTasks.length > 0 && (
                <div style={styles.tipBox}>
                    <FaLightbulb style={{color: '#ffc107'}} />
                    <span style={{fontSize: '0.85rem', color: '#555'}}>
                        <b>Pro Tip:</b> Group similar tasks (like calls or emails) to save mental energy.
                    </span>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '10px'
    },
    title: {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#333'
    },
    content: {
        marginBottom: '15px',
        minHeight: '80px'
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    line: {
        margin: 0,
        fontSize: '0.95rem',
        color: '#555',
        lineHeight: '1.5'
    },
    loadingState: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#888',
        fontStyle: 'italic'
    },
    tipBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#fff8e1',
        padding: '10px 15px',
        borderRadius: '10px',
        borderLeft: '4px solid #ffc107'
    }
};

export default DailySummaryAI;