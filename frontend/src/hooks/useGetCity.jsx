import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      dispatch(setLocation({ lat: latitude, lon: longitude }))

      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`
      )

      const locationData = result?.data?.results?.[0]
      console.log("Geoapify raw data:", locationData)

      const detectedCity =
        locationData.city ||
        locationData.state_district ||
        locationData.county ||
        locationData.suburb

      dispatch(setCurrentCity(detectedCity))
      dispatch(setCurrentState(locationData.state))
      dispatch(setCurrentAddress(locationData.address_line2 || locationData.address_line1))
      dispatch(setAddress(locationData.address_line2))
    })
  }, []) // ✅ fixed
}

export default useGetCity
