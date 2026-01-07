import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay, addHours, startOfDay, endOfDay, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format, parse, startOfWeek, getDay, locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

const CustomToolbar = (toolbar) => {
    const goToBack = () => toolbar.onNavigate('PREV');
    const goToNext = () => toolbar.onNavigate('NEXT');
    const goToCurrent = () => toolbar.onNavigate('TODAY');

    const goToMonth = () => toolbar.onView('month');
    const goToWeek = () => toolbar.onView('week');
    const goToDay = () => toolbar.onView('day');

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

    // --- Smart scroll point calculation (Smart Scroll) ---
    const scrollTime = useMemo(() => {
        // Default: 08:00 in the morning
        const defaultTime = new Date(1970, 1, 1, 8, 0, 0);

        if (view === Views.MONTH) return defaultTime;

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

    return (
        <div style={unified ? styles.calendarWrapperUnified : styles.calendarWrapper}>
            <DnDCalendar
                localizer={localizer}
                events={events}
                defaultView={Views.MONTH}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}

                // Here's the magic: smart automatic scrolling
                scrollToTime={scrollTime}

                eventPropGetter={eventStyleGetter}
                components={{ toolbar: CustomToolbar }}
                style={{ height: '100%' }} // Always 100% height to fill container

                selectable={true}
                resizable={true}

                onSelectSlot={(slotInfo) => onDateSelect(slotInfo.start)}
                onEventDrop={onEventDrop}
                onEventResize={onEventDrop}
                onSelectEvent={(event) => onEventClick(event.resource)}

                dayPropGetter={() => ({ style: { cursor: 'pointer' } })}
            />
        </div>
    );
};

const styles = {
    calendarWrapper: { 
        backgroundColor: 'white', 
        padding: '32px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
        border: 'none',
        height: '100%', 
        display: 'flex',
        flexDirection: 'column'
    },
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
        borderRadius: '50px', 
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
        borderRadius: '12px' 
    },
    viewBtn: { 
        border: 'none', 
        background: 'transparent', 
        padding: '7px 14px', 
        borderRadius: '8px', 
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
        borderRadius: '8px', 
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