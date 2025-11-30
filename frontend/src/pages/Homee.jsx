import React from 'react'
import Navv from '../components/Navv'
import dp from "../assets/profile.jpg"
import { FaPlus } from "react-icons/fa6";
import { MdOutlinePhotoCamera } from "react-icons/md";



function Homee() {
  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-start justify-center gap-[20px] px-[20px] flex-col lg:flex-row'>
      <Navv />
      <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg rounded-lg p-[10px] relative '>
        <div className='w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer'>
          <img src="" alt="" className='w-full' />
        <MdOutlinePhotoCamera className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-gray-800 cursor-pointer' />

        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center relative top-[-45px] left-[30px]">
          <img src={dp} alt="profile" className=" h-full" />
        
        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center'>
        <FaPlus />

        </div>

      </div>
      <div className='w-full lg:w-[50%] min-h-[200px] bg-[white] shadow-lg'>

      </div>
      <div className='w-full lg:w-[25%] min-h-[200px] bg-[white] shadow-lg'>

      </div>
    </div>
  )
}

export default Homee