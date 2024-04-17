import React from "react";

// for razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// To handle a payment
const handlePayment = async () => {
  // Dynamically load the Razorpay script so that we can create an instance of Razorpay
  const res = await loadRazorpayScript();

  if (!res) {
    alert("Failed to load Razorpay SDK. Check your connection or try again.");
    return;
  }

  const options = {
    key: "rzp_test_FTcWVtO6GaHFlO", // Replace with your key_id from Razorpay Dashboard
    amount: "50000", // Amount is in smallest currency unit. Here, 50000 paise = 500 INR
    currency: "INR",
    name: "Web Touter",
    description: "Typing test Payment",
    image: "https://webtouter.com/wp-content/uploads/elementor/thumbs/51-removebg-preview-e1698666812110-qemezppy9czl6ops5j8wvxrcupi8wegb87uwfo6qkg.png",
    handler: function (response) {
      // Payment was successful, you can use the response object to handle the payment confirmation
      alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    },
    prefill: {
      name: "John Doe",
      email: "johndoe@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

// Define an interface for the component's props
interface CardProps {
  title: string;
  price: string;
  features: Feature[];
  currency: string;
  month: string;
  button_text: string;
}

interface Feature {
  text: string;
  correct: boolean;
}

const PriceCard: React.FC<CardProps> = ({
  title,
  price,
  features,
  currency,
  month,
  button_text,
}) => {
  return (
    <div className="h-full max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <div className="flex items-baseline mb-5">
        <span className="text-3xl font-bold">{currency}</span>
        <span className="text-4xl font-bold ml-1">{price}</span>
        <span className="text-xl text-gray-500 ml-1">{month}</span>
      </div>

      <ul className="flex-grow mb-6 w-full ms-4 ">
        {features.map((feature, index) => (
          <li key={index} className="mb-3 flex items-center">
            <span className="text-sm text-gray-700 flex items-center">
              {feature.correct ? (
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 01.083 1.32l-.083.094-8.5 8.5a1 1 0 01-1.32.083l-.094-.083-4.5-4.5a1 1 0 011.32-1.497l.094.083L8 13.585l7.293-7.292a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={handlePayment}
        className="mt-auto bg-primary text-white font-bold py-2 px-4 rounded w-full"
      >
        {button_text}
      </button>
    </div>
  );
};

export default PriceCard;
