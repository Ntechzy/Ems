'use client'
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from './Modal';
import axios from 'axios';
import toast from 'react-hot-toast';

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
        wallet: "",
        taskInput: "",
        priceInput: "",
        company: "ntechzy",
        tasks: [],
    });

    useEffect(() => {
        const fetchTask = async () => {
            const res = await axios.get("/api/admin-actions/expense");

            console.log(res);

            if (res.status === 200 && res.data.expenseSheet.length > 0) {
                console.log("here");

                const events = res.data.expenseSheet.map((expense) => {
                    const taskDate = new Date(expense.date);
                    const createdDate = new Date(expense.createdAt);

                    const taskStart = new Date(
                        taskDate.getFullYear(),
                        taskDate.getMonth(),
                        taskDate.getDate(),
                        createdDate.getHours(),
                        createdDate.getMinutes()
                    );
                    const taskEnd = new Date(taskStart);
                    taskEnd.setHours(taskStart.getHours() + 1);

                    return {
                        id: expense._id,
                        title: expense.title,
                        amount: expense.amount,
                        company: expense.company,
                        start: taskStart,
                        end: taskEnd,
                        createdAt: createdDate,
                        date: taskDate,
                    };
                });

                setCalendarState((prev) => ({
                    ...prev,
                    events: events,
                }));
                setModalState({ wallet: res.data.totalAmount });
            }
        };

        fetchTask();
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

    const handleSaveTasks = async () => {
        if (modalState.tasks.length === 0) {
            alert("No tasks to save!");
            return;
        }

        const currentDateTime = new Date();
        const taskPayload = modalState.tasks.map((task) => ({
            title: task.task,
            amount: parseFloat(task.price),
            date: calendarState.selectedSlot.start,
            createdAt: currentDateTime,
            company: modalState.company,
        }));

        try {
            const savedEvents = [];
            for (const task of taskPayload) {
                const response = await axios.post("/api/admin-actions/expense", task);

                if (response.status === 200) {
                    const savedTask = response.data.expense;
                    const taskDate = new Date(savedTask.date);  
                    const taskCreated = new Date(savedTask.createdAt);  
 
                    const taskStart = new Date(
                        taskDate.getFullYear(),
                        taskDate.getMonth(),
                        taskDate.getDate(),
                        taskCreated.getHours(),
                        taskCreated.getMinutes()
                    );
                    const taskEnd = new Date(taskStart);
                    taskEnd.setHours(taskStart.getHours() + 1);

                    savedEvents.push({
                        id: savedTask._id,
                        title: savedTask.title,
                        amount: savedTask.amount,
                        start: taskStart,
                        end: taskEnd,
                        createdAt: taskCreated,
                        date: taskDate, // Store the intended task date for agenda view
                    });
                } else {
                    toast.error(`Failed to save task: ${task.title}`);
                }
            }

            if (savedEvents.length > 0) {
                setCalendarState((prev) => ({
                    ...prev,
                    events: [...prev.events, ...savedEvents],
                }));
                resetModalState();
                toast.success("Tasks saved successfully!");
            } else {
                toast.error("No tasks were saved.");
            }
        } catch (error) {
            toast.error("Error saving tasks:", error.message);
        }
    };

    const CustomEvent = ({ event }) => (
        <div className="flex justify-between items-center m-auto text-white font-bold bg-[#008080] p-2 rounded-xl">
            <span>{event.title}</span>
            <span>Rs. {event.amount}</span>
        </div>
    );

    return (
        <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-lg border-2 border-gray-300">
            <div>
                <h1>
                    Total Expenditure = {modalState.wallet}
                </h1>
            </div>
            <div className="relative bg-white rounded-lg shadow-lg p-6 border-dashed border-2 border-gray-400">
                <div className="absolute top-0 left-4 h-full w-2 bg-gray-300 rounded-full"></div>
                <DnDCalendar
                    localizer={localizer}
                    events={calendarState.events}
                    startAccessor="start"
                    endAccessor="end"
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
                    company={modalState.company}
                    setTaskInput={(value) =>
                        setModalState((prev) => ({ ...prev, taskInput: value }))
                    }
                    setPriceInput={(value) =>
                        setModalState((prev) => ({ ...prev, priceInput: value }))
                    }
                    setCompany={(value) =>
                        setModalState((prev) => ({ ...prev, company: value }))
                    }

                    wallet={modalState.wallet}
                />
            )}
        </div>
    );
};

export default MyCalendar;
