'use client'
import moment from 'moment';
import { useCallback, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from './Modal';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const MyCalendar = () => {
    const [calendarState, setCalendarState] = useState({
        events: [],
        view: 'month',
        currentDate: new Date(),
        selectedSlot: null,
        showModal: false,
    });

    const [modalState, setModalState] = useState({
        wallet: 500,
        taskInput: "",
        priceInput: "",
        tasks: [],
    });

    const onEventDrop = useCallback(({ event: droppedEvent, start }) => {
        setCalendarState((prev) => ({
            ...prev,
            events: prev.events.map((e) =>
                e.id === droppedEvent.id
                    ? { ...e, start, end: start }
                    : e
            ),
        }));
    }, []);

    const handleAddTask = () => {
        if (!modalState.taskInput || !modalState.priceInput) {
            alert("Please fill in both task and price!");
            return;
        }
        setModalState((prev) => ({
            ...prev,
            tasks: [...prev.tasks, { id: Date.now(), task: prev.taskInput, price: prev.priceInput }],
            taskInput: "",
            priceInput: "",
        }));
    };

    const resetModalState = () => {
        setCalendarState((prev) => ({ ...prev, showModal: false }));
        setModalState({
            wallet: modalState.wallet,
            taskInput: "",
            priceInput: "",
            tasks: [],
        });
    };

    const handleSaveTasks = () => {
        if (modalState.tasks.length === 0) {
            alert("No tasks to save!");
            return;
        }
        const newEvents = modalState.tasks.map((task) => ({
            id: task.id,
            task: task.task,
            price: task.price,
            start: calendarState.selectedSlot.start,
            end: calendarState.selectedSlot.end,
        }));
        setCalendarState((prev) => ({
            ...prev,
            events: [...prev.events, ...newEvents],
        }));
        resetModalState();
    };

    const CustomEvent = ({ event }) => (
        <div className="flex justify-between items-center m-auto text-white font-bold bg-[#008080] p-2 rounded-xl">
            <span>{event.task}</span>
            <span>Rs. {event.price}</span>
        </div>
    );

    return (
        <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-lg border-2 border-gray-300">
            <div>
                <h1>
                    Total Alloted Fund = {modalState.wallet}
                </h1>
                <h1>
                    Remaining fund =
                </h1>
            </div>
            <div className="relative bg-white rounded-lg shadow-lg p-6 border-dashed border-2 border-gray-400">
                <div className="absolute top-0 left-4 h-full w-2 bg-gray-300 rounded-full"></div>
                <DnDCalendar
                    localizer={localizer}
                    events={calendarState.events}
                    startAccessor="start"
                    endAccessor="end"
                    onEventDrop={onEventDrop}
                    date={calendarState.currentDate}
                    onNavigate={(date) =>
                        setCalendarState((prev) => ({ ...prev, currentDate: date }))
                    }
                    onSelectSlot={({ start }) => {
                        const now = new Date();
                        const adjustedTime = new Date(start.setHours(now.getHours(), now.getMinutes()));

                        setCalendarState((prev) => ({
                            ...prev,
                            selectedSlot: { start: adjustedTime, end: adjustedTime },
                            showModal: true,
                        }));
                        setModalState((prev) => ({ ...prev, tasks: [] }));
                    }}
                    selectable
                    views={['month', 'agenda']}
                    view={calendarState.view}
                    onView={(view) =>
                        setCalendarState((prev) => ({ ...prev, view }))
                    }
                    style={{ height: 500 }}
                    components={{
                        event: CustomEvent,
                    }}
                />
            </div>
            {calendarState.showModal && (
                <Modal
                    tasks={modalState.tasks}
                    onAddTask={handleAddTask}
                    onSave={handleSaveTasks}
                    onClose={resetModalState}
                    taskInput={modalState.taskInput}
                    priceInput={modalState.priceInput}
                    setTaskInput={(value) =>
                        setModalState((prev) => ({ ...prev, taskInput: value }))
                    }
                    setPriceInput={(value) =>
                        setModalState((prev) => ({ ...prev, priceInput: value }))
                    }
                    wallet={modalState.wallet}
                />
            )}
        </div>
    );
};

export default MyCalendar;
