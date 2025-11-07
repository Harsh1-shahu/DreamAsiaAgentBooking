import React, { useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import { FaUndoAlt, FaRegCalendarAlt } from "react-icons/fa";
import { SiInformatica } from "react-icons/si";
import { GiPriceTag } from "react-icons/gi";
import { TbReceiptTax } from "react-icons/tb";
import CartItems from "./CartItems";
import { useBooking } from "../../../context/BookingContext";

interface BookingDropDownProps {
    onSelectPackage: (pkg: string) => void;
    onCartChange: (hasItems: boolean) => void;
}

const BookingDropDown: React.FC<BookingDropDownProps> = ({
    onSelectPackage,
    onCartChange,
}) => {
    const {
        visitDate,
        setVisitDate,
        cartItems,
        setCartItems,
        selectedPackage,
        setSelectedPackage,
        products,
        API_BASE
    } = useBooking();

    useEffect(() => {
        console.log("🔹 Current Visit Date:", visitDate);
        console.log("🔹 Selected Package:", selectedPackage);
        console.log("🔹 Cart Items:", cartItems);
    }, [visitDate, selectedPackage, cartItems]);

    const cartRef = useRef<HTMLDivElement | null>(null);

    const selectedProduct = products.find((p) => p.NAME === selectedPackage);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedPackage(value);
        onSelectPackage(value);
    };

    const handleAddToCart = () => {
        if (!selectedPackage || !visitDate || !selectedProduct) return;

        const formattedDate = visitDate.toLocaleDateString("en-GB");
        const price = `Rs ${selectedProduct.RATE}`;

        const existingIndex = cartItems.findIndex(
            (item) => item.name === selectedPackage && item.visitDate === formattedDate
        );

        let updatedCart;
        if (existingIndex >= 0) {
            updatedCart = [...cartItems];
            updatedCart[existingIndex].quantity += 1;
        } else {
            updatedCart = [
                ...cartItems,
                { name: selectedPackage, quantity: 1, visitDate: formattedDate, price },
            ];
        }

        setCartItems(updatedCart);
        onCartChange(updatedCart.length > 0);

        setTimeout(() => {
            if (cartRef.current) {
                cartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    const handleIncrementItem = (name: string, visitDate: string) => {
        const updatedCart = cartItems.map((item) =>
            item.name === name && item.visitDate === visitDate
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        setCartItems(updatedCart);
    };

    const handleDecrementItem = (name: string, visitDate: string) => {
        const updatedCart = cartItems
            .map((item) =>
                item.name === name && item.visitDate === visitDate
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0);

        setCartItems(updatedCart);
        onCartChange(updatedCart.length > 0);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-purple-50 to-purple-100 text-gray-800 shadow-lg rounded-3xl p-6 w-full max-w-3xl"
            >
                <h1 className="md:text-2xl font-bold text-center mb-5 text-indigo-700">
                    🎟️ Select Ticket Package
                </h1>

                {/* Select Date & Package */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 mt-3">
                    {/* Date Picker */}
                    <div className="relative">
                        <DatePicker
                            selected={visitDate}
                            onChange={(date) => {
                                if (
                                    cartItems.length > 0 &&
                                    visitDate &&
                                    date &&
                                    visitDate.getTime() !== date.getTime()
                                ) {
                                    const proceed = window.confirm(
                                        "Changing the visit date will clear your cart. Do you want to proceed?"
                                    );
                                    if (!proceed) return;
                                    setCartItems([]);
                                    onCartChange(false);
                                    setSelectedPackage("");
                                }
                                setVisitDate(date);
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select visit date"
                            minDate={new Date()}
                            className="w-full py-2 pr-6 border border-indigo-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <FaRegCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
                    </div>

                    {/* Package Dropdown */}
                    <select
                        onChange={handleSelect}
                        value={selectedPackage}
                        className="w-[15.5rem] md:w-auto px-4 md:pr-16 py-2 border border-indigo-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="" disabled className="hidden">
                            Please select a package
                        </option>
                        {products.map((p) => (
                            <option key={p.PRODUCTID} value={p.NAME}>
                                {p.NAME}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Details */}
                {selectedProduct && visitDate ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row gap-6 items-center"
                    >
                        <img
                            src={`${API_BASE}/UploadImages/${selectedProduct.IMG}`}
                            alt={selectedProduct.NAME}
                            className="md:w-40 md:h-40 rounded-2xl object-cover shadow-lg"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-indigo-700 mb-2 text-center md:text-left">
                                {selectedProduct.NAME}
                            </h2>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <SiInformatica className="text-pink-600" />
                                    <span>{selectedProduct.DESCRIPTION}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <GiPriceTag className="text-indigo-600" />
                                    <span>Price: Rs {selectedProduct.MRP}</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <TbReceiptTax className="text-blue-600" />
                                    <span>GST: {selectedProduct.GST_PERC}%</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <FaUndoAlt className="text-green-600" />
                                    <span>Cancel up to 3 days before your visit date</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <img src="/Booking/logo.png" className="w-28" alt="placeholder" />
                        <p className="text-gray-600 mt-6 py-4 text-center">
                            Please select date and package to view ticket details.
                        </p>
                    </div>
                )}

                {/* Add to Cart Button */}
                <div className="w-full flex items-center justify-center mt-4">
                    <button
                        disabled={!selectedPackage || !visitDate}
                        onClick={handleAddToCart}
                        className={`rounded-md p-2 w-40 text-white font-semibold ${selectedPackage && visitDate
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        Add to Cart
                    </button>
                </div>
            </motion.div>

            {/* Cart Section */}
            {cartItems.length > 0 && (
                <div ref={cartRef} className="w-full flex flex-col items-center">
                    <CartItems
                        cartItems={cartItems}
                        onIncrementItem={handleIncrementItem}
                        onDecrementItem={handleDecrementItem}
                    />
                </div>
            )}
        </div>
    );
};

export default BookingDropDown;
