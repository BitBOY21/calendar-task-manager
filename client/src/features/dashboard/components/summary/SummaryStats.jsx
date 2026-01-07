import React from 'react';
import Card from '../../../../components/ui/Card';
import { FaFire, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const StatCard = ({ icon, color, label, value, subValue }) => (
    <Card style={{ 
        padding: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        width: '100%',
        borderLeft: `4px solid ${color}`
    }}>
        <div style={{
            width: '45px', height: '45px', borderRadius: '12px', 
            backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontSize: '1.2rem', color: color, flexShrink: 0
        }}>
            {icon}
        </div>
        <div>
            <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px', fontWeight: '600' }}>
                {label}
            </span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333', lineHeight: '1' }}>
                {value} <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: '500' }}>{subValue}</span>
            </div>
        </div>
    </Card>
);

const SummaryStats = ({ tasks }) => {
    const total = tasks.length;
    const pendingUrgent = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
    const totalUrgent = tasks.filter(t => t.priority === 'High').length;
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const pendingCount = tasks.filter(t => !t.isCompleted).length;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <StatCard 
                icon={<FaHourglassHalf />} 
                color="#ffc107" 
                label="Total Pending" 
                value={pendingCount} 
                subValue={`/ ${total}`} 
            />
            <StatCard 
                icon={<FaFire />} 
                color="#dc3545" 
                label="Total Urgent" 
                value={pendingUrgent} 
                subValue={`/ ${totalUrgent}`} 
            />
            <StatCard 
                icon={<FaCheckCircle />} 
                color="#28a745" 
                label="Total Completed" 
                value={completedCount} 
                subValue={`/ ${total}`} 
            />
        </div>
    );
};

export default SummaryStats;