import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import Card from '../../../../components/ui/Card';
import { subDays, format, isSameDay } from 'date-fns';

const SummaryCharts = ({ tasks }) => {
    const priorityData = useMemo(() => {
        const high = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
        const medium = tasks.filter(t => t.priority === 'Medium' && !t.isCompleted).length;
        const low = tasks.filter(t => t.priority === 'Low' && !t.isCompleted).length;
        
        return [
            { name: 'High', value: high, color: '#ff4d4d' },
            { name: 'Medium', value: medium, color: '#ffad33' },
            { name: 'Low', value: low, color: '#28a745' },
        ].filter(d => d.value > 0);
    }, [tasks]);

    const weeklyActivity = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
        
        return last7Days.map(day => {
            const completedTasks = tasks.filter(task => 
                task.isCompleted && isSameDay(new Date(task.updatedAt || task.createdAt), day)
            ).length;
            
            return {
                day: format(day, 'EEE'), // "Mon", "Tue", etc.
                tasks: completedTasks,
            };
        });
    }, [tasks]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginBottom: '25px' }}>
            <Card style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '16px', fontWeight: '700' }}>Pending Priorities</h3>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={5}>
                                {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ marginTop: '16px', textAlign: 'center', display: 'flex', gap: '15px' }}>
                    {priorityData.map(d => <span key={d.name} style={{color: d.color, fontSize:'0.85rem', fontWeight: '600'}}>● {d.name}</span>)}
                </div>
            </Card>

            <Card style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '16px', fontWeight: '700' }}>Completed Tasks (Last 7 Days)</h3>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <BarChart data={weeklyActivity} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'rgba(0, 123, 255, 0.1)'}} />
                            <Bar dataKey="tasks" fill="#007bff" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default SummaryCharts;