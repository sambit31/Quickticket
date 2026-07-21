import React from 'react'
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/Loading";
import { dateFormat } from '../../lib/dateFormat';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';



const Deshboard = () => {

  const { axios, getToken, user, image_base_url } = useAppContext();

    const currency = import.meta.env.VITE_CURRENCY;

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUsers: 0,
    });

    const [loading, setLoading] = useState(true);

    const dashboardCards = [
        {
            title: "Total Bookings",
            value: dashboardData.totalBookings,
            icon: ChartLineIcon,
            color: "bg-blue-500",
        },
        {
            title: "Total Revenue",
            value: `${currency}${dashboardData.totalRevenue}`,
            icon: CircleDollarSignIcon,
            color: "bg-green-500",
        },
        {
            title: "Active Shows",
            value: dashboardData.activeShows?.length || 0,
            icon: PlayCircleIcon,
            color: "bg-pink-500",
        },
        {
            title: "Total Users",
            value: dashboardData.totalUsers,
            icon: UsersIcon,
            color: "bg-yellow-500",
        },
    ];

    const fetchDashboardData = async () => {
      try {
        const {data} = await axios.get("/api/admin/dashboard",{
            headers:{
                Authorization: `Bearer ${await getToken()}`}})
               
                if(data.success){
                    setDashboardData(data.dashboardData)
                    setLoading(false)
                }
      } catch (error) {
toast.error(
    error.response?.data?.message || "Failed to fetch dashboard"
  );      }
    };

    useEffect(() => {
        if(user){
            fetchDashboardData();
        }
    }, [user]);

    


    if (loading) return <Loading />;


    return (
        <div className="space-y-10">
            <BlurCircle top='-0px' />
            <BlurCircle right='20px'bottom='-100px'/>
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Admin <span className="text-primary">Dashboard</span>
                </h1>

                <p className="text-gray-400 mt-2">
                    Welcome back! Here's what's happening today.
                </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-lg hover:border-primary hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{card.title}</p>

                                <h2 className="text-3xl font-bold text-white mt-2">
                                    {card.value}
                                </h2>
                            </div>

                            <div className={`${card.color} p-3 rounded-xl`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Shows */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                    Active Shows
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dashboardData.activeShows?.map((show, index) => (
                        <div
                            key={index}
                            className="bg-[#111827] rounded-2xl overflow-hidden border border-white/10 hover:border-primary hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Poster */}
                            <img
                                src={image_base_url + show.movie.poster_path}
                                alt={show.movie.title}
                                className="w-full h-72 object-cover"
                            />

                            {/* Details */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white truncate">
                                    {show.movie.title}
                                </h3>

                                {/* Price & Rating */}
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xl font-bold text-white">
                                        {currency}
                                        {show.showPrice}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <StarIcon className="w-4 h-4 fill-pink-500 text-pink-500" />
                                        <span className="text-gray-300 text-sm font-medium">
                                            {show.movie.vote_average.toFixed(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Date */}
                                <p className="text-gray-400 text-sm mt-4">
                                    {dateFormat(show.showDateTime)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Deshboard