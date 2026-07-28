import axios from "axios";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const downloadTicket = async (bookingId) => {

    const res = await axios.get(
        `${backendUrl}/api/booking/${bookingId}/ticket`,
        {
            responseType: "blob",
        }
    );

    return res.data;
};