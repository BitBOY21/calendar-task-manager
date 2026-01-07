import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { 
    format, parse, startOfWeek, getDay, addHours, startOfDay, endOfDay, addDays,
    startOfYear, endOfYear, addYears, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay 
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import Card from '../../../components/ui/Card'; // Import Card component

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format, parse, startOfWeek, getDay, locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

// --- Year View Components ---

const MiniMonth = ({ month, events, onView, onNavigate }) => {
    const days = eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month)
    });
    
    const startDay = getDay(startOfMonth(month)); // 0 for Sunday
    
    const handleMonthClick = () => {
        onNavigate(month);
        onView('month');
    };

    const handleDayClick = (day) => {
        onNavigate(day);
        onView('day');
    };

    return (
        <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            <div 
                onClick={handleMonthClick}
                style={{ fontWeight: '700', textAlign: 'center', marginBottom: '10px', cursor: 'pointer', color: '#333', fontSize: '0.9rem' }}
            >
                {format(month, 'MMMM')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', fontSize: '0.75rem' }}>
                {['S','M','T','W','T','F','S'].map(d => <div key={d} style={{ textAlign: 'center', color: '#999', fontWeight: '600', marginBottom: '4px' }}>{d}</div>)}
                
                {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                
                {days.map(day => {
                    const hasEvent = events.some(e => isSameDay(e.start, day));
                    const isToday = isSameDay(day, new Date());
                    return (
                        <div 
                            key={day.toString()} 
                            onClick={() => handleDayClick(day)}
                            style={{ 
                                textAlign: 'center', 
                                cursor: 'pointer', 
                                borderRadius: '50%', 
                                width: '24px', 
                                height: '24px', 
                                lineHeight: '24px',
                                backgroundColor: isToday ? '#007bff' : (hasEvent ? '#e3f2fd' : 'transparent'),
                                color: isToday ? 'white' : (hasEvent ? '#007bff' : '#333'),
                                fontWeight: (isToday || hasEvent) ? 'bold' : 'normal',
                                margin: '0 auto'
                            }}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const YearView = ({ date, events, onView, onNavigate }) => {
    const months = eachMonthOfInterval({
        start: startOfYear(date),
        end: endOfYear(date)
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', height: '100%', overflowY: 'auto', padding: '10px' }}>
            {months.map((month, idx) => (
                <MiniMonth 
                    key={idx} 
                    month={month} 
                    events={events} 
                    onView={onView}
                    onNavigate={onNavigate}
                />
            ))}
        </div>
    );
};

YearView.range = date => {
    return [startOfYear(date), endOfYear(date)];
};

YearView.navigate = (date, action) => {
    if (action === 'PREV') return addYears(date, -1);
    if (action === 'NEXT') return addYears(date, 1);
    return date;
};

YearView.title = (date, { localizer }) => {
    return localizer.format(date, 'yyyy');
};

// --- Toolbar ---

const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToCurrent = () => toolbar.onNavigate('TODAY');

    const goToMonth = () => toolbar.onView('month');
    const goToWeek = () => toolbar.onView('week');
    const goToDay = () => toolbar.onView('day');
    const goToYear = () => toolbar.onView('year');

    const label = () => (
        <span style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            textTransform: 'capitalize',
            lineHeight: '1.4',
            letterSpacing: '-0.01em',
            fontFamily: 'inherit'
        }} className="text-gradient">
            {toolbar.label}
        </span>
    );

    return (
        <div style={styles.toolbarContainer}>
            <div style={styles.navGroup}>
                <button type="button" onClick={goToBack} style={styles.navBtn}>❮</button>
                <button type="button" onClick={goToCurrent} style={styles.todayBtn}>Today</button>
                <button type="button" onClick={goToNext} style={styles.navBtn}>❯</button>
            </div>

            <div style={styles.labelContainer}>{label()}</div>

            <div style={styles.viewGroup}>
                <button onClick={goToYear} style={toolbar.view === 'year' ? styles.activeViewBtn : styles.viewBtn}>Year</button>
                <button onClick={goToMonth} style={toolbar.view === 'month' ? styles.activeViewBtn : styles.viewBtn}>Month</button>
                <button onClick={goToWeek} style={toolbar.view === 'week' ? styles.activeViewBtn : styles.viewBtn}>Week</button>
                <button onClick={goToDay} style={toolbar.view === 'day' ? styles.activeViewBtn : styles.viewBtn}>Day</button>
            </div>
        </div>
    );
};

const CalendarView = ({ tasks, onDateSelect, onEventDrop, onEventClick, unified = false }) => {
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());

    // Define views configuration
    const { views } = useMemo(() => ({
        views: {
            month: true,
            week: true,
            day: true,
            year: YearView
        }
    }), []);

    // --- Smart scroll point calculation (Smart Scroll) ---
    const scrollTime = useMemo(() => {
        // Default: 08:00 in the morning
        const defaultTime = new Date(1970, 1, 1, 8, 0, 0);

        if (view === Views.MONTH || view === 'year') return defaultTime;

        // 1. Define date range for checking (current day or current week)
        let startRange, endRange;
        if (view === Views.DAY) {
            startRange = startOfDay(date);
            endRange = endOfDay(date);
        } else {
            // In week view, start from Sunday (or according to Locale)
            startRange = startOfWeek(date, { weekStartsOn: 0 });
            endRange = addDays(startRange, 7);
        }

        // 2. Find the earliest task in this range
        let earliestMinutes = 24 * 60; // Start from maximum (end of day)
        let foundTask = false;

        tasks.forEach(task => {
            if (!task.dueDate) return;
            const taskDate = new Date(task.dueDate);

            // Does the task fall within the displayed range?
            if (taskDate >= startRange && taskDate < endRange) {
                const minutes = taskDate.getHours() * 60 + taskDate.getMinutes();
                if (minutes < earliestMinutes) {
                    earliestMinutes = minutes;
                    foundTask = true;
                }
            }
        });

        // 3. Apply smart logic
        if (!foundTask) return defaultTime;

        // Add a "buffer" of one hour before the task (to have some space)
        const bufferedMinutes = Math.max(0, earliestMinutes - 60);

        if (view === Views.DAY) {
            // In day view: stick to the task (with buffer)
            const hours = Math.floor(bufferedMinutes / 60);
            const minutes = bufferedMinutes % 60;
            return new Date(1970, 1, 1, hours, minutes, 0);
        } else {
            // In week view: take the minimum between (the task) and (08:00)
            // That is: if task is at 06:00 -> scroll to 05:00.
            // If task is at 14:00 -> scroll to 08:00 (not 13:00).
            const defaultMinutes = 8 * 60; // 08:00
            const finalMinutes = Math.min(bufferedMinutes, defaultMinutes);

            const hours = Math.floor(finalMinutes / 60);
            const minutes = finalMinutes % 60;
            return new Date(1970, 1, 1, hours, minutes, 0);
        }

    }, [tasks, view, date]);

    // Prepare events for calendar
    const events = useMemo(() => tasks.map(task => {
        const startDate = task.dueDate ? new Date(task.dueDate) : new Date();
        const endDate = task.endDate
            ? new Date(task.endDate)
            : new Date(startDate.getTime() + 60 * 60 * 1000);

        return {
            id: task._id,
            title: task.title,
            start: startDate,
            end: endDate,
            allDay: false, // Forces display within the hourly table
            resource: task,
            isCompleted: task.isCompleted,
            priority: task.priority
        };
    }), [tasks]);

    const eventStyleGetter = (event) => {
        let backgroundColor = '#28a745';
        if (event.priority === 'High') backgroundColor = '#ff4d4d';
        if (event.priority === 'Medium') backgroundColor = '#ffad33';

        if (event.isCompleted) {
            backgroundColor = '#adb5bd';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: event.isCompleted ? 0.6 : 0.9,
                color: 'white',
                border: 'none',
                display: 'block',
                fontSize: '0.85em',
                textDecoration: event.isCompleted ? 'line-through' : 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }
        };
    };

    // Use Card component for the wrapper to get the "White Card" style
    const CalendarWrapper = unified ? 'div' : Card;
    const wrapperProps = unified ? { style: styles.calendarWrapperUnified } : { style: { height: '100%', display: 'flex', flexDirection: 'column', padding: '20px' } };

    return (
        <CalendarWrapper {...wrapperProps}>
            <DnDCalendar
                localizer={localizer}
                events={events}
                defaultView={Views.MONTH}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                popup={true} // Show "Show more" popup on overflow
                views={views} // Pass custom views

                // Here's the magic: smart automatic scrolling
                scrollToTime={scrollTime}

                eventPropGetter={eventStyleGetter}
                components={{ 
                    toolbar: CustomToolbar,
                    month: {
                        dateHeader: ({ label }) => (
                            <div style={{ textAlign: 'center', fontWeight: '600', color: '#555' }}>
                                {label}
                            </div>
                        )
                    }
                }}
                style={{ height: '100%', backgroundColor: 'white' }} // Ensure white bg for calendar itself

                selectable={true}
                resizable={true}

                onSelectSlot={(slotInfo) => onDateSelect(slotInfo.start)}
                onEventDrop={onEventDrop}
                onEventResize={onEventDrop}
                onSelectEvent={(event) => onEventClick(event.resource)}

                dayPropGetter={() => ({ style: { cursor: 'pointer' } })}
            />
        </CalendarWrapper>
    );
};

const styles = {
    // Styles are now handled by Card component or inline overrides
    calendarWrapperUnified: { 
        backgroundColor: 'transparent', 
        padding: '0', 
        borderRadius: '0', 
        boxShadow: 'none', 
        border: 'none', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
    },
    toolbarContainer: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px', 
        paddingBottom: '16px', 
        borderBottom: '2px solid #f0f0f0' 
    },

    navGroup: { 
        display: 'flex', 
        gap: '10px', 
        alignItems: 'center' 
    },
    navBtn: { 
        background: 'none', 
        border: '1px solid #e0e0e0', 
        borderRadius: '50%', 
        width: '38px', 
        height: '38px', 
        cursor: 'pointer', 
        fontSize: '1.1rem', 
        color: '#666', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        transition: 'all 0.2s ease', 
        fontWeight: '500', 
        fontFamily: 'inherit', 
        lineHeight: '1' 
    },
    todayBtn: { 
        backgroundColor: '#f1f3f5', 
        border: '1px solid #e0e0e0', 
        borderRadius: '20px', // Rounded corners
        padding: '8px 16px', 
        cursor: 'pointer', 
        fontWeight: '600', 
        color: '#333', 
        fontSize: '0.875rem', 
        lineHeight: '1.4', 
        transition: 'all 0.2s ease', 
        fontFamily: 'inherit' 
    },

    labelContainer: { 
        flex: 1, 
        textAlign: 'center' 
    },

    viewGroup: { 
        display: 'flex', 
        gap: '4px', 
        backgroundColor: '#f1f3f5', 
        padding: '4px', 
        borderRadius: '20px' // Rounded corners for the group container
    },
    viewBtn: { 
        border: 'none', 
        background: 'transparent', 
        padding: '7px 14px', 
        borderRadius: '16px', // Rounded corners for buttons
        fontSize: '0.8125rem', 
        color: '#666', 
        cursor: 'pointer', 
        fontWeight: '500', 
        lineHeight: '1.4', 
        transition: 'all 0.2s ease', 
        fontFamily: 'inherit' 
    },
    activeViewBtn: { 
        border: 'none', 
        background: 'white', 
        padding: '7px 14px', 
        borderRadius: '16px', // Rounded corners for active button
        fontSize: '0.8125rem', 
        color: '#007bff', 
        cursor: 'pointer', 
        fontWeight: '700', 
        lineHeight: '1.4', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
        fontFamily: 'inherit'
    }
};

export default CalendarView;