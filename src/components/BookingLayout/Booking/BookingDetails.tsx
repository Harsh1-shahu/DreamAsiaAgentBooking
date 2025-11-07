import React from "react";
import { useBooking } from "../../../context/BookingContext";

interface ReceiptProps {
    name: string;
    contact: string;
    requestId?: string;
    onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ name, contact, onClose }) => {
    const { visitDate, cartItems, products, requestId } = useBooking();

    // Helper: Convert "Rs 599" → 599
    const parsePrice = (price: string) =>
        parseFloat(price.replace(/[^0-9.]/g, "")) || 0;

    // ✅ Map each cart item to product details from API
    const enrichedCart = cartItems.map((item) => {
        const product = products.find((p) => p.NAME === item.name);
        const baseRate = product?.RATE || parsePrice(item.price);
        const gst = product?.GST_PERC || 18;
        const gstAmount = (baseRate * gst) / 100;
        const totalPerUnit = baseRate + gstAmount;

        return {
            ...item,
            rate: baseRate,
            gstPerc: gst,
            gstAmount,
            totalPerUnit,
            description: product?.DESCRIPTION || "—",
        };
    });

    // ✅ Totals
    const subtotal = enrichedCart.reduce(
        (total, item) => total + item.rate * item.quantity,
        0
    );
    const totalGST = enrichedCart.reduce(
        (total, item) => total + item.gstAmount * item.quantity,
        0
    );
    const grandTotal = subtotal + totalGST;

    return (
        <div className="bg-white text-black p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
            {/* Close Button */}
            <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 font-bold"
                onClick={onClose}
            >
                ✕
            </button>

            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
                Booking Receipt
            </h2>

            {/* Visit Date + Request ID */}
            <div className="bg-purple-300 px-3 py-2 rounded-md mb-4 space-y-1">
                <div className="flex justify-between text-sm font-semibold text-gray-700">
                    <span>Visit Date:</span>
                    <span className="text-black font-bold">
                        {visitDate ? visitDate.toLocaleDateString("en-GB") : "—"}
                    </span>
                </div>

                {/* ✅ Added Request ID Display */}
                {requestId && (
                    <div className="flex justify-between text-sm text-gray-700">
                        <span>Request ID:</span>
                        <span className="text-indigo-700 font-semibold">{requestId}</span>
                    </div>
                )}
            </div>

            {/* Customer Info */}
            <div className="space-y-1 mb-4 text-sm">
                <p>
                    <strong>Name:</strong> {name}
                </p>
                <p>
                    <strong>Contact:</strong> {contact}
                </p>
            </div>

            <hr className="border-gray-300 my-3" />

            {/* Cart Items */}
            <div className="space-y-2 mb-4 text-sm">
                <p className="border-b border-gray-300 pb-1 font-semibold">
                    Ticket Packages
                </p>

                {enrichedCart.length > 0 ? (
                    enrichedCart.map((item, index) => (
                        <div
                            key={`${item.name}-${item.visitDate}-${index}`}
                            className="text-gray-800 space-y-1 border-b border-gray-200 pb-2"
                        >
                            <div className="flex justify-between">
                                <span className="font-medium">{item.name}</span>
                                <span>
                                    Rs {(item.rate * item.quantity).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                    {item.quantity} × Rs {item.rate.toFixed(2)} (Base)
                                </span>
                                
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No items in cart</p>
                )}
            </div>

            <hr className="border-gray-300 my-3" />

            {/* Totals */}
            <div className="text-sm space-y-2">
                <div className="flex justify-between">
                    <span>Sub-total:</span>
                    <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>GST Total:</span>
                    <span>Rs {totalGST.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-semibold text-lg">
                    <span>Grand Total:</span>
                    <span className="text-indigo-700">Rs {grandTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Pay Button */}
            <div className="text-center mt-6">
                <button
                    onClick={onClose}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium"
                >
                    Pay
                </button>
            </div>
        </div>
    );
};

export default Receipt;
