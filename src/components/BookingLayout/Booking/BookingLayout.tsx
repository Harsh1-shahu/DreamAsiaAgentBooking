import { useState } from "react";
import { HiTicket } from "react-icons/hi2";
import BookingDropDown from "./BookingDropDown";
import CustomersDetails from "./CustomersDetails";
import BannerSlider from "../../ecommerce/BannerSlider";
import { useBooking } from "../../../context/BookingContext";
import { motion } from "framer-motion";

const BookingLayout = () => {
  const [cartHasItems, setCartHasItems] = useState<boolean>(false);
  const { setSelectedPackage } = useBooking();

  return (
    <>
      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 z-50 flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md">
        <img src="logo.png" className="w-28 md:w-36 drop-shadow-lg py-1" alt="Dreamasia Logo" />
      </div>

      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center mt-[60px] overflow-x-hidden">
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 px-4 md:px-12 lg:px-20 py-6 md:py-10">
          {/* Left: Banner */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl border border-purple-300">
              <BannerSlider />
            </div>
          </motion.div>

          {/* Right: Header + Intro */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-1/2 flex flex-col items-center bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-100 rounded-2xl p-8 md:p-9 gap-4 text-center shadow-xl border border-white/30"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-2 bg-white/70 shadow-md border border-yellow-200 rounded-lg backdrop-blur-sm">
              <HiTicket size={32} className="text-yellow-500" />
              <p className="lg:text-2xl font-bold text-gray-900">
                Our Park Tickets
              </p>
            </div>

            {/* Intro Text */}
            <div className="text-gray-800 space-y-2">
              <h1 className="text-xl md:text-3xl font-semibold leading-tight">
                Discover our range of Dreamasia Park tickets!
              </h1>
              <p className="text-sm md:text-lg leading-relaxed max-w-lg mx-auto">
                Choose the Dream Park ticket that’s best for you — whether you want to explore one Dream Park or both.
                Book now and make memories that last a lifetime!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Booking Dropdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl px-4 md:px-0 mb-4"
        >
          <BookingDropDown
            onSelectPackage={setSelectedPackage}
            onCartChange={setCartHasItems}
          />
        </motion.div>

        {/* Customer Details Section */}
        {cartHasItems && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-3xl px-4 md:px-0 mb-6"
          >
            <CustomersDetails />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default BookingLayout;
