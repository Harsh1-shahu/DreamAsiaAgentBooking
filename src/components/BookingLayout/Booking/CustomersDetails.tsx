import React, { useState } from "react";
import Receipt from "./BookingDetails";
import { useBooking } from "../../../context/BookingContext";

const CustomersDetails = () => {
  const { name, setName, contact, setContact, createBooking } = useBooking();
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<{ name: string; contact: string } | null>(null);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: { name?: string; contact?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitClicked(true);

    if (!validate()) return;

    setLoading(true);

    try {
      // ✅ Call createBooking API
      const response = await createBooking();

      console.log("Booking Response:", response);

      if (response.success) {
        // Save for showing in receipt modal
        setBookingData({ name, contact });

        // Show the receipt modal
        setShowReceipt(true);

        // Reset form after success
        setName("");
        setContact("");
      } else {
        alert(`Booking failed: ${response.message}`);
      }
    } catch (error) {
      console.error("Booking API error:", error);
      alert("Something went wrong while creating booking!");
    } finally {
      setLoading(false);
      setSubmitClicked(false);
    }
  };

  return (
    <div className="w-full flex justify-center mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-purple-50 to-purple-100 text-black shadow-lg rounded-2xl p-6 w-full max-w-3xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">
          Customer Details
        </h2>

        {/* Name Input */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              submitClicked && errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {submitClicked && errors.name && (
            <span className="text-red-500 text-sm mt-1">{errors.name}</span>
          )}
        </div>

        {/* Contact Input */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Contact Number</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            pattern="\d{10}"
            inputMode="numeric"
            placeholder="Enter contact number"
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              submitClicked && errors.contact
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {submitClicked && errors.contact && (
            <span className="text-red-500 text-sm mt-1">{errors.contact}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded-lg font-semibold text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Receipt Modal */}
      {showReceipt && bookingData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-2 z-50">
          <Receipt
            name={bookingData.name}
            contact={bookingData.contact}
            onClose={() => setShowReceipt(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CustomersDetails;
