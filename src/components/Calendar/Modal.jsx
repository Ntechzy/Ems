import Input from "../Input";

const Modal = ({ tasks, onAddTask, onSave, onClose, taskInput, priceInput, setTaskInput, setPriceInput }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div
                className="bg-white w-11/12 md:w-1/2 lg:w-1/3 rounded-lg shadow-lg p-6"
                style={{
                    backgroundImage: "linear-gradient(to bottom, #f8f8f8, #ffffff)",
                    border: "1px dashed #ccc",
                }}
            >
                {/* Receipt Header */}
                <h2 className="text-center text-xl font-bold mb-4 text-gray-800">Receipt - Expense Receipt</h2>
                <p className="text-center text-sm text-gray-500 border-b border-dashed pb-2">
                    Add your product name and its price below
                </p>

                {/* Task Input Section */}
                <div className="mb-4 mt-4">
                    <Input
                        label="Task Name"
                        handleChange={(e) => setTaskInput(e.target.value)}
                        value={taskInput}
                        name="Task Name"
                    />
                    <Input
                        label="Task Price"
                        handleChange={(e) => setPriceInput(e.target.value)}
                        value={priceInput}
                        name="Task Price"
                        type="number"
                    />
                    <button
                        onClick={onAddTask}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-2 shadow hover:bg-blue-400"
                    >
                        Add Task
                    </button>
                </div>
                <div
                    className="max-h-40 overflow-y-auto border-t border-dashed border-gray-300 pt-4"
                    style={{
                        fontFamily: "'Courier New', Courier, monospace",
                    }}
                >
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div key={index} className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">{task.task}</span>
                                <span className="text-green-600 font-bold">Rs.{task.price}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 italic">No tasks added yet.</p>
                    )}
                </div>

                {/* Receipt Footer */}
                <div className="mt-4 pt-4 border-t border-dashed">
                    <div className="text-right mb-2">
                        <span className="text-gray-700 font-medium">Total:</span>
                        <span className="text-green-600 font-bold ml-2">
                            Rs. {tasks.reduce((total, task) => total + parseFloat(task.price || 0), 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <button
                            onClick={onSave}
                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-400"
                        >
                            Save
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal