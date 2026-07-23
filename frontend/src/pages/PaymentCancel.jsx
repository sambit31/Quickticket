import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const PaymentCancel = () => {

    const {bookingId}=useParams();

    const navigate=useNavigate();

    const {axios}=useAppContext();

    useEffect(()=>{

        const cancel=async()=>{

            try{

                await axios.post("/api/booking/cancel",{
                    bookingId
                });

                toast.success("Booking Cancelled");

            }catch(err){
                console.log(err);
            }

            navigate("/my-bookings");

        }

        cancel();

    },[])

    return <p className="text-center mt-20">Cancelling booking...</p>;

}

export default PaymentCancel;