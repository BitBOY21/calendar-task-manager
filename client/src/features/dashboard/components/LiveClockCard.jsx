import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import { FaClock } from 'react-icons/fa';

const LiveClockCard = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateString = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <Card style={{ 
            padding: '15px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            minHeight: '90px',
            borderLeft: '4px solid #007bff'
        }}>
            <div style={{
                width: '45px', height: '45px', borderRadius: '12px', 
                backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', fontSize: '1.2rem', color: '#007bff'
            }}>
                <FaClock />
            </div>
            <div>
                <span style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '2px', fontWeight: '600' }}>
                    {dateString}
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#333', lineHeight: '1' }}>
                    {timeString}
                </div>
            </div>
        </Card>
    );
};

export default LiveClockCard;