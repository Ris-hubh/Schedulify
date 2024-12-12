import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase/firebase'; // Adjust path as needed
import styles from './Calendar.module.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventDescription, setEventDescription] = useState('');
    const [eventPriority, setEventPriority] = useState('low');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!auth.currentUser) return;

            const userId = auth.currentUser.uid;
            const userDoc = doc(firestore, 'users', userId);

            try {
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setEvents(userData.events || {});
                } else {
                    console.log('No events found for user.');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    const handleDayClick = (day) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        setSelectedDate(formattedDate);
        setShowModal(true);
    };

    const handleAddEvent = async () => {
        if (!eventDescription || !auth.currentUser) return;

        const userId = auth.currentUser.uid;
        const userDoc = doc(firestore, 'users', userId);

        try {
            await updateDoc(userDoc, {
                [`events.${selectedDate}`]: [
                    ...(events[selectedDate] || []),
                    { description: eventDescription, checked: false, priority: eventPriority }
                ]
            });

            setEvents((prevEvents) => ({
                ...prevEvents,
                [selectedDate]: [
                    ...(prevEvents[selectedDate] || []),
                    { description: eventDescription, checked: false, priority: eventPriority }
                ]
            }));

            setEventDescription('');
            setEventPriority('low');
            setShowModal(false);
        } catch (error) {
            if (error.code === 'not-found') {
                await setDoc(userDoc, {
                    events: {
                        [selectedDate]: [
                            { description: eventDescription, checked: false, priority: eventPriority }
                        ]
                    }
                });
            } else {
                console.error('Error updating events:', error);
            }
        }
    };

    const handleRemoveEvent = async (eventIndex) => {
        if (!auth.currentUser) return;

        const userId = auth.currentUser.uid;
        const userDoc = doc(firestore, 'users', userId);

        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[selectedDate].splice(eventIndex, 1);
            if (updatedEvents[selectedDate].length === 0) {
                delete updatedEvents[selectedDate];
            }

            updateDoc(userDoc, { events: updatedEvents }).catch((error) =>
                console.error('Error removing event:', error)
            );

            return updatedEvents;
        });
    };

    const handleCheckmarkEvent = (eventIndex) => {
        if (!auth.currentUser) return;

        const userId = auth.currentUser.uid;
        const userDoc = doc(firestore, 'users', userId);

        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[selectedDate][eventIndex].checked =
                !updatedEvents[selectedDate][eventIndex].checked;

            updateDoc(userDoc, { events: updatedEvents }).catch((error) =>
                console.error('Error updating checkmark:', error)
            );

            return updatedEvents;
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setEventDescription('');
        setEventPriority('low');
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthDays = Array.from({ length: daysInMonth }, (_, index) =>
        new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1)
    );

    const upcomingHighPriorityTasks = monthDays
        .flatMap((day) => {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const dayEvents = events[formattedDate] || [];
            return dayEvents
                .filter((event) => event.priority === 'high' && !event.checked)
                .map((event) => ({ date: formattedDate, description: event.description }));
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4);

    const calculateProgressPoints = () => {
        return Object.values(events)
            .flat()
            .reduce((totalXP, event) => {
                if (event.checked) {
                    if (event.priority === 'low') totalXP += 50;
                    if (event.priority === 'mid') totalXP += 100;
                    if (event.priority === 'high') totalXP += 200;
                }
                return totalXP;
            }, 0);
    };

    const totalXP = calculateProgressPoints();

    return (
        <div className={styles.container}>
            <div className={styles.calendarSection}>
                <h1 className={styles.heading}>Your Calendar</h1>
                <div className={styles.calendar}>
                    <div className={styles.monthYear}>
                        <button onClick={prevMonth}>Previous</button>
                        <span>{format(currentDate, 'MMMM yyyy')}</span>
                        <button onClick={nextMonth}>Next</button>
                    </div>
                    <div className={styles.days}>
                        {monthDays.map((day) => (
                            <div
                                key={day}
                                className={styles.day}
                                onClick={() => handleDayClick(day)}
                            >
                                {format(day, 'd')}
                                {events[format(day, 'yyyy-MM-dd')] && (
                                    <div className={styles.eventMarker}>•</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <h2>Events for {selectedDate}</h2>
                    <ul>
                        {(events[selectedDate] || []).map((event, index) => (
                            <li key={index} style={{ color: getPriorityColor(event.priority) }}>
                                <span
                                    style={{ textDecoration: event.checked ? 'line-through' : 'none' }}
                                >
                                    {event.description}
                                </span>
                                <button onClick={() => handleCheckmarkEvent(index)}>
                                    {event.checked ? 'Uncheck' : 'Check'}
                                </button>
                                <button onClick={() => handleRemoveEvent(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Add event description"
                    />
                    <select
                        value={eventPriority}
                        onChange={(e) => setEventPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="mid">Mid</option>
                        <option value="high">High</option>
                    </select>
                    <button onClick={handleAddEvent}>Add Event</button>
                    <button onClick={closeModal}>Close</button>
                </div>
            )}
            <div className={styles.upcomingTasks}>
                <h2>Upcoming High Priority Tasks</h2>
                <ul>
                    {upcomingHighPriorityTasks.map((task, index) => (
                        <li key={index}>
                            <span>
                                {task.date}: {task.description}
                            </span>
                        </li>
                    ))}
                </ul>
                <div>
                    <strong>Progress Point: {totalXP} XP</strong>
                </div>
            </div>
        </div>
    );
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high':
            return '#ff6347';
        case 'mid':
            return '#ffcc00';
        case 'low':
            return '#28a745';
        default:
            return '#333';
    }
};

export default Calendar;
