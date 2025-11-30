import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setDonorData } from "../redux/userSlice";

function useGetMyDonor() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchDonor = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/donor/get-my`, { withCredentials: true });
        dispatch(setDonorData(res.data));
      } catch (err) {
        console.log("Failed to fetch donor profile:", err);
      }
    };

    fetchDonor();
  }, [userData, dispatch]);
}

export default useGetMyDonor;
