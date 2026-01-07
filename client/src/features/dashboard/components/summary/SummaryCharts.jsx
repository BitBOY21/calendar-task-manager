import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import Card from '../../../../components/ui/Card';

const SummaryCharts = ({ tasks }) => {
    const pendingUrgent = tasks.filter(t => t.priority === 'High' && !t.isCompleted).length;
    const completedCount = tasks.filter(t => t.isCompleted).length;

    const priorityData = [
        { name: 'High', value: pendingUrgent, color: '#ff4d4d' },
        { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium' && !t.isCompleted).length, color: '#ffad33' },
        { name: 'Low', value: tasks.filter(t => t.priority === 'Low' && !t.isCompleted).length, color: '#28a745' },
    ].filter(d => d.value > 0);

    const weeklyActivity = [
        { day: 'Sun', tasks: 2 }, { day: 'Mon', tasks: 5 }, { day: 'Tue', tasks: 3 },
        { day: 'Wed', tasks: completedCount > 5 ? 6 : completedCount }, { day: 'Thu', tasks: 4 },
        { day: 'Fri', tasks: 1 }, { day: 'Sat', tasks: 0 },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <Card style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '16px', fontWeight: '700' }}>Task Priorities</h3>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                                {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    {priorityData.map(d => <span key={d.name} style={{color: d.color, fontSize:'0.85rem', margin:'0 5px'}}>● {d.name}</span>)}
                </div>
            </Card>

            <Card style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#333', marginBottom: '16px', fontWeight: '700' }}>Weekly Activity</h3>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <BarChart data={weeklyActivity}>
                            <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="tasks" fill="#007bff" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default SummaryCharts;