import { useUser } from "@clerk/react";
import { useEffect } from "react";
import axiosInstance from "../../lib/axios";


const SyncUser = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const sync = async () => {
      try {
        await axiosInstance.post("/api/users/sync", {
          id: user.id,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.primaryEmailAddress?.emailAddress,
          image: user.imageUrl,
        });

        console.log("✅ User Synced");
      } catch (error) {
        console.error("❌ Sync Failed:", error);
      }
    };

    sync();
  }, [isLoaded, user]);

  return null;
};

export default SyncUser;