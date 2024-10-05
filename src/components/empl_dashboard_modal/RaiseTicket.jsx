
const RaiseTicket = ({ toggleTicketModal }) => {

    const handleRaiseTicket = () => {
        toggleTicketModal();
    };

    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50 bg-[#00000088]" onClick={toggleTicketModal}>
            <div className="bg-white p-6 rounded-lg shadow-md absolute top-[50vh] translate-y-[-50%] w-[90%] md:w-[40%]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">Raise Ticket</h2>
                {/* Ticket Form */}
                <form onSubmit={handleRaiseTicket}>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Describe the issue..."
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={toggleTicketModal}
                            className="bg-gray-300 text-gray-700 py-2 px-4 rounded ml-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-button_blue text-white py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RaiseTicket