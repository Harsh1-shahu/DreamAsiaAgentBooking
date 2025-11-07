// ✅ BookingContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export type Product = {
  PRODUCTID: number;
  PROD_CODE: number;
  NAME: string;
  MRP: number;
  RATE: number;
  ACTIVE: string;
  DESCRIPTION: string;
  IMG: string;
  GST_PERC: number;
};

export type CartItem = {
  name: string;
  quantity: number;
  visitDate: string;
  price: string;
};

type BookingContextType = {
  visitDate: Date | null;
  setVisitDate: (date: Date | null) => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  selectedPackage: string;
  setSelectedPackage: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  contact: string;
  setContact: React.Dispatch<React.SetStateAction<string>>;
  getProducts: () => Promise<void>;
  products: Product[];
  createBooking: () => Promise<BookingResponse>;
  requestId: string | null; 
  setRequestId: React.Dispatch<React.SetStateAction<string | null>>; 
  API_BASE: string
};

export type BookingRequest = {
  agentCode: string;
  bookingDate: string;
  prodCodes: string;
  Qtys: string;
  CustomerName: string;
  CustomerMobileNo: string;
};

export type BookingResponse = {
  success: boolean;
  message: string;
  requestId?: string;
  totalAmount?: string;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within a BookingProvider");
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [requestId, setRequestId] = useState<string | null>(null); 

  const getProducts = async () => {
    try {
      const url = `${API_BASE}/api/api/getProducts?prodCode=0&search=&from=0&to=500&Active=Y`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.ResponseStatus === "success") {
        const parsedData: Product[] = JSON.parse(result.Data.data);
        setProducts(parsedData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const createBooking = async (): Promise<BookingResponse> => {
    try {
      const formData = new FormData();

      const formattedDate = visitDate
        ? `${visitDate.getFullYear()}/${String(visitDate.getMonth() + 1).padStart(2, "0")}/${String(
            visitDate.getDate()
          ).padStart(2, "0")}`
        : "";

      const prodCodes = cartItems
        .map((item) => {
          const product = products.find((p) => p.NAME === item.name);
          return product ? product.PROD_CODE : null;
        })
        .filter((code): code is number => code !== null)
        .join(",");

      const qtys = cartItems.map((item) => item.quantity).join(",");

      formData.append("agentCode", "100");
      formData.append("bookingDate", formattedDate);
      formData.append("prodCodes", prodCodes);
      formData.append("Qtys", qtys);
      formData.append("CustomerName", name);
      formData.append("CustomerMobileNo", contact);

      const response = await fetch(`${API_BASE}/tempBooking`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.ResponseStatus === "success") {
        const reqId = result.Data?.RequestId || null;
        setRequestId(reqId); // ✅ store in context
        return {
          success: true,
          message: result.ResponseMessage,
          requestId: reqId,
          totalAmount: result.Data?.TotalAmount,
        };
      } else {
        return { success: false, message: result.ResponseMessage || "Booking failed" };
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      return { success: false, message: "Network or server error" };
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <BookingContext.Provider
      value={{
        visitDate,
        setVisitDate,
        cartItems,
        setCartItems,
        selectedPackage,
        setSelectedPackage,
        name,
        setName,
        contact,
        setContact,
        getProducts,
        products,
        createBooking,
        requestId, 
        setRequestId,
        API_BASE, 
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
