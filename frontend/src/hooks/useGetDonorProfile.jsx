import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setDonorData } from "../redux/userSlice";
import { serverUrl } from "../App";

const useGetDonorProfile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    if (!userData?._id) return;

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/donor/get-my`, { withCredentials: true });
        dispatch(setDonorData(data));
      } catch (error) {
        console.error("Failed to fetch donor profile:", error.response?.data || error.message);
        dispatch(setDonorData(null));
      }
    };

    fetchProfile();
  }, [userData?._id]);
};

export default useGetDonorProfile;
