import React from "react";
import { useBooking, CartItem } from "../../../context/BookingContext"; // ✅ import CartItem type from context

interface CartItemsProps {
    cartItems: CartItem[];
    onIncrementItem: (name: string, visitDate: string) => void;
    onDecrementItem: (name: string, visitDate: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
    cartItems,
    onIncrementItem,
    onDecrementItem,
}) => {
    const { visitDate } = useBooking();

    // Helper: Convert "$50" → 50 (number)
    const parsePrice = (price: string) => parseFloat(price.replace(/[^0-9.]/g, ""));

    // Calculate total amount
    const totalAmount = cartItems.reduce(
        (total, item) => total + parsePrice(item.price) * item.quantity,
        0
    );

    return (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 text-black shadow-lg rounded-2xl p-4 w-full max-w-3xl">
            {/* Header with Visit Date */}
            <div className="w-full flex justify-between items-center mb-2 md:pr-6">
                <h2 className="md:text-xl font-bold text-indigo-700">🛒 Cart Items</h2>

                <div className="flex items-center gap-2 bg-purple-300 px-2 py-1 rounded-md">
                    <span className="text-sm font-semibold text-gray-700">
                        Visit Date:
                    </span>
                    <span className="text-xs md:text-sm text-black font-bold">
                        {visitDate ? visitDate.toLocaleDateString("en-GB") : "—"}
                    </span>
                </div>
            </div>

            {/* Subheading row */}
            <div className="flex justify-between py-1 border-b border-gray-300 font-semibold text-gray-600 mb-2 text-sm">
                <span className="flex-1">Package</span>
                <span className="w-28 text-center">Quantity</span>
                <span className="flex-1 text-center">Price</span>
            </div>

            {/* Cart Items */}
            <ul className="space-y-2">
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => {
                        const basePrice = parsePrice(item.price);
                        const totalItemPrice = basePrice * item.quantity;

                        return (
                            <li
                                key={`${item.name}-${item.visitDate}-${index}`}
                                className="flex justify-between items-center border-b border-gray-200 py-2"
                            >
                                <span className="flex-1 text-xs md:text-sm">{item.name}</span>

                                {/* Quantity controls */}
                                <div className="w-28 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onDecrementItem(item.name, item.visitDate)}
                                        className="text-black hover:text-red-700 font-semibold bg-red-300 px-2 rounded-full"
                                    >
                                        -
                                    </button>
                                    <span className="font-semibold">x{item.quantity}</span>
                                    <button
                                        onClick={() => onIncrementItem(item.name, item.visitDate)}
                                        className="text-black hover:text-green-700 font-semibold bg-green-300 px-2 rounded-full"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Dynamic total price per item */}
                                <span className="flex-1 text-xs md:text-sm text-center text-gray-700">
                                    Rs {totalItemPrice.toFixed(2)}
                                </span>
                            </li>
                        );
                    })
                ) : (
                    <li className="text-center text-gray-500 py-4">Your cart is empty</li>
                )}
            </ul>

            {/* Total Amount */}
            {cartItems.length > 0 && (
                <div className="flex justify-between items-center pr-2 md:pr-[7vw] mt-4 border-t pt-3 border-gray-300">
                    <span className="md:text-lg font-semibold text-indigo-700">
                        Total amount:
                    </span>
                    <span className="text-xs md:text-lg font-bold text-gray-800 bg-white py-1 px-3 rounded-md">
                        Rs {totalAmount.toFixed(2)}
                    </span>
                </div>
            )}
        </div>
    );
};

export default CartItems;
