import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [shows, setShows] = useState([]);
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);


  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_URL;

 const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();



const fetchIsAdmin = async () => {
  try {
    const token = await getToken();

    const { data } = await axios.get("/api/admin/is-admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setIsAdmin(data.isAdmin);
  } catch (error) {
    setIsAdmin(false);
        toast.error("you are not admin")
  } finally {
    setLoadingAdmin(false);
  }
};




  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");

      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  

 const fetchFavoritesMovies = async () => {
  try {
    const token = await getToken();

    const { data } = await axios.get("/api/users/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.success) {
      setFavouriteMovies(data.movies);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error.response?.data || error);
  }
};

 useEffect(() => {
  const loadData = async () => {
    await fetchShows();
  };

  loadData();
}, []);



useEffect(() => {
  const loadUserData = async () => {
    if (user) {
      await fetchIsAdmin();
      await fetchFavoritesMovies();
    }
  };

   loadUserData(); 
}, [user]);

  const value = {
    axios,
    getToken,
    navigate,
    isAdmin,
    user,
    shows,
    favouriteMovies,
    fetchShows,
    fetchIsAdmin,
    loadingAdmin,
    fetchFavoritesMovies,
    image_base_url
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);



