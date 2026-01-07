import React from 'react';
import Card from '../../../components/ui/Card';
import { FaFire, FaCheckCircle, FaHourglassHalf, FaClock } from 'react-icons/fa';
import LiveClockCard from './LiveClockCard';

const StatCard = ({ icon, color, label, value, subValue }) => (
    <Card style={{ 
        padding: '15px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        minHeight: '90px',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{
            width: '45px', height: '45px', borderRadius: '12px', 
            backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '1.2rem', color: color
        }}>
            {icon}
        </div>
        <div>
            <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px', fontWeight: '600' }}>
                {label}
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#333', lineHeight: '1' }}>
                {value} <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: '500' }}>{subValue}</span>
            </div>
        </div>
    </Card>
);

const StatsRow = ({ tasks }) => {
    // Filter for TODAY only
    const todayTasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate);
        const today = new Date();
        return d.getDate() === today.getDate() &&
               d.getMonth() === today.getMonth() &&
               d.getFullYear() === today.getFullYear();
    });

    const totalToday = todayTasks.length;
    const totalUrgent = todayTasks.filter(t => t.priority === 'High').length;
    const pendingUrgent = todayTasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
    const completedCount = todayTasks.filter(t => t.isCompleted).length;
    const pendingCount = todayTasks.filter(t => !t.isCompleted).length;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: '100%' }}>
            <LiveClockCard />
            
            <StatCard 
                icon={<FaHourglassHalf />} 
                color="#ffc107" 
                label="Pending" 
                value={pendingCount} 
                subValue={`/ ${totalToday}`} 
            />
            
            <StatCard 
                icon={<FaFire />} 
                color="#dc3545" 
                label="Urgent" 
                value={pendingUrgent} 
                subValue={`/ ${totalUrgent}`} 
            />
            
            <StatCard 
                icon={<FaCheckCircle />} 
                color="#28a745" 
                label="Completed" 
                value={completedCount} 
                subValue={`/ ${totalToday}`} 
            />
        </div>
    );
};

export default StatsRow;