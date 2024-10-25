import toast from "react-hot-toast";

export const handleResponse = (response) => {
    if (response.status === 200) {
        toast.success(response.data.message);
    } else {
        toast.error(response.data.message ? response.data.message : response.error);
        if (response.data.error) {
            toast.error(response.data.error);
        }
    }
};

export const handleError = (error) => {
    const newError = [];
    if (error.inner) {
        error.inner.forEach(elem => {
            newError[elem.path] = elem.message;
        });
    } else {
        console.log(error);

        toast.error(error.response?.data.message || "Unexpected error occurred");
        if (error.response?.data.error) {
            toast.error(error.response.data.error);
        }
    }
    return newError;
};