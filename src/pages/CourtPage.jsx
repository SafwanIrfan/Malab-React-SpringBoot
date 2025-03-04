import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
   FaArrowLeft,
   FaArrowRight,
   FaHeart,
   FaSpinner,
   FaTruckLoading,
} from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import AppContext from "../contexts/Context";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

const CourtPage = () => {
   const { id } = useParams();
   const [court, setCourt] = useState(null);
   const [imageIndex, setImageIndex] = useState(0);
   const { favourite, setFavourite, getOneWeek } = useContext(AppContext);

   const oneWeek = getOneWeek();

   useEffect(() => {
      const fetchCourt = async () => {
         try {
            const response = await axios.get(
               `http://localhost:8080/court/${id}`
            );
            const courtData = response.data;

            setCourt(courtData);
         } catch (error) {
            console.log("Fetching error : ", error);
         }
      };
      fetchCourt();
   }, [id]);

   const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this court?")) {
         try {
            await axios.delete(`http://localhost:8080/court/${id}/delete`);
            setCourt(court.filter((court) => court.id !== id));
         } catch (error) {
            console.log("Error deleting court : ", error);
         }
      }
   };

   if (!court) {
      return (
         <div className="h-96 flex justify-center items-center ">
            <h2 className="text-black font-bold text-6xl">
               <FaSpinner className={<FaSpinner /> ? "animate-spin" : ""} />
            </h2>
         </div>
      );
   }

   return (
      <div className="px-8 py-10 bg-black text-white">
         <div>
            {court.imageUrls.length > 1 ? (
               <div className="items-center gap-2  flex justify-center">
                  <button
                     className={
                        imageIndex > 0
                           ? "bg-gray-100 rounded-full w-10 h-10 hover:bg-gray-200 text-black transition-all"
                           : "invisible"
                     }
                     onClick={() => {
                        setImageIndex(imageIndex - 1);
                        console.log("img index : ", imageIndex);
                     }}
                  >
                     <FaArrowLeft className="mx-3" />
                  </button>
                  <img
                     src={court.imageUrls[imageIndex]}
                     alt="Court Image"
                     className="h-60 w-[693px] md:h-80 rounded "
                  />
                  <button
                     className={
                        imageIndex < court.imageUrls.length - 1
                           ? "bg-gray-100 rounded-full w-10 h-10 hover:bg-gray-200 text-black transition-all "
                           : "invisible"
                     }
                     onClick={() => {
                        setImageIndex(imageIndex + 1);
                        console.log("img index : ", imageIndex);
                     }}
                  >
                     <FaArrowRight className="mx-3" />
                  </button>
               </div>
            ) : (
               <img
                  src={court.imageUrls[0]}
                  alt="Court Image"
                  className="w-full h-60 rounded "
               />
            )}
            <div className="text-center my-10">
               <p className="text-5xl font-sans font-bold">{court.name}</p>
            </div>
            <div className="p-6 border-2 border-green-600 rounded  mt-4">
               <div className="flex justify-between">
                  <p className="text-3xl font-bold mb-4">
                     Rs {court.pricePerHour}
                     <span className="font-normal">/hour</span>
                  </p>

                  <button
                     onClick={() => setFavourite((prevState) => !prevState)}
                     className={
                        favourite ? "text-red-600  transition-all " : ""
                     }
                  >
                     <FaHeart style={{ width: "1.6rem", height: "1.6rem" }} />
                  </button>
               </div>
               <div className="flex gap-2">
                  <FaLocationPin className="text-red-600 mt-1 h-5 w-5" />

                  <p className="text-gray-400 text-xl">{court.location}</p>
               </div>
            </div>
            <div>
               <div>
                  <h3 className="text-3xl font-bold my-6">View Slots</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7   gap-4 text-center">
                     {oneWeek.map((week, index) => (
                        <Link
                           to={`/timings/${court.id}/${week.day}/${week.date}`}
                           key={index}
                           className=" bg-green-600 p-4 text-white hover:font-bold rounded shadow-xl transition-all"
                        >
                           <p>{week.day.toUpperCase()}</p>
                           <p>{week.date}</p>
                        </Link>
                     ))}
                  </div>
               </div>

               {/* All Slots Section */}
               {/* <div className="border-2 p-4 rounded border-green-600">
                  <h3 className="font-bold text-3xl mb-4">
                     {slots.length > 0 ? "All Slots" : "OOPS!"}
                  </h3>
                  {slots.length > 0 ? (
                     <table className="border-2 border-black  w-full">
                        <thead>
                           <tr>
                              <th className=" p-2 border-r-black">Day</th>
                              <th className=" border-r-black">Starting Time</th>
                              <th className=" border-r-black">Ending Time</th>
                              <th>Status</th>
                           </tr>
                        </thead>
                        <td className="border-2 border-black font-bold  text-center">
                           {slots.map((slot, index) => (
                              <div
                                 className={
                                    index < slots.length - 1
                                       ? "p-2 border-b-2  border-b-black w-full"
                                       : "p-2 w-full"
                                 }
                                 key={index}
                              >
                                 {slot.days}
                              </div>
                           ))}
                        </td>
                        <td className="border-2 border-black font-bold text-center">
                           {slots.map((slot, index) => (
                              <div
                                 className={
                                    index < slots.length - 1
                                       ? "p-2 border-b-2  border-b-black w-full"
                                       : "p-2 w-full"
                                 }
                                 key={index}
                              >
                                 {slot.startTime}
                              </div>
                           ))}
                        </td>
                        <td className="border-2 border-black font-bold text-center">
                           {slots.map((slot, index) => (
                              <div
                                 className={
                                    index < slots.length - 1
                                       ? "p-2 border-b-2  border-b-black w-full"
                                       : "p-2 w-full"
                                 }
                                 key={index}
                              >
                                 {slot.endTime}
                              </div>
                           ))}
                        </td>
                        <td className="border-2 border-black font-bold text-center">
                           {slots.map((slot, index) =>
                              slot.status === "AVAILABLE" ? (
                                 <Link
                                    className={`
                                    ${
                                       slot.status === "AVAILABLE"
                                          ? "text-green-600 grid hover:text-green-700"
                                          : " text-red-600 cursor-not-allowed grid "
                                    }
                                    ${
                                       index < slots.length - 1
                                          ? "p-2 border-b-2  border-b-black w-full grid underline "
                                          : "p-2 w-full grid underline"
                                    }
                                 `}
                                    key={index}
                                 >
                                    {slot.status}
                                 </Link>
                              ) : (
                                 <div
                                    className={`
                                    ${
                                       slot.status === "AVAILABLE"
                                          ? "text-green-600"
                                          : " text-red-600 cursor-not-allowed "
                                    }
                                    ${
                                       index < slots.length - 1
                                          ? "p-2 border-b-2  border-b-black w-full"
                                          : "p-2 w-full"
                                    }
                                 `}
                                    key={index}
                                 >
                                    {slot.status}
                                 </div>
                              )
                           )}
                        </td>
                     </table>
                  ) : (
                     <div className="font-bold text-2xl">
                        No Slots Available for this court!
                     </div>
                  )}
               </div> */}
            </div>
         </div>
      </div>
   );
};

export default CourtPage;
