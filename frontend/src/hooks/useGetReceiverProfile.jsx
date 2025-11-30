import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setReceiverData } from "../redux/userSlice";
import { serverUrl } from "../App";

const useGetReceiverProfile = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReceiverProfile = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/receiver/get-my`, {
          withCredentials: true,
        });

        if (res.data) {
          dispatch(setReceiverData(res.data));
        } else {
          dispatch(setReceiverData(null)); // profile doesn't exist
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          dispatch(setReceiverData(null)); // profile not found
        } else {
          console.error("Failed to fetch receiver profile:", err);
        }
      }
    };

    fetchReceiverProfile();
  }, [dispatch]);
};

export default useGetReceiverProfile;
