import React from 'react';
import Card from '../../../../components/ui/Card';

const ActivityLog = ({ tasks }) => {
    const recentActivity = tasks
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 10)
        .map(t => ({
            id: t._id,
            action: t.isCompleted ? 'Completed' : 'Created',
            taskTitle: t.title,
            time: new Date(t.updatedAt || t.createdAt).toLocaleDateString('en-GB')
        }));

    return (
        <Card style={{ padding: '25px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#333', fontWeight: '700', margin: '0 0 20px 0' }}>📜 My Activity</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                {recentActivity.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ 
                            background: 'linear-gradient(135deg, rgba(0,123,255,0.1), rgba(111,66,193,0.1))', 
                            width: '40px', height: '40px', borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
                        }}>
                            {item.action === 'Completed' ? '✅' : '✨'}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.95rem', color: '#333', fontWeight: '500' }}>
                                You <strong>{item.action}</strong> the task "{item.taskTitle}"
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#999', marginTop: '2px' }}>{item.time}</span>
                        </div>
                    </div>
                ))}
                {recentActivity.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', padding: '20px' }}>
                        No recent activity.
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ActivityLog;