import React from "react";
import PriceCard from "./pricecard/PriceCard";

const App = () => {
  const cards = [
    {
      title: "Demo",
      price: "free",
      currency: "",
      month: "",
      features: [
        { text: "10 passages", correct: true },
        { text: "Daily progress tracking", correct: true },
        { text: "Keystroke and Accuracy count", correct: false },
        { text: "Weekly progress tracking", correct: false },
        { text: "Monthly progress tracking", correct: false },
        // Include incorrect features as needed
        // { text: 'Feature not included', correct: false },
      ],
      button_text: "Start Now",
    },
    {
      title: "Standard Marathi ",
      price: "99",
      currency: "₹",
      month: "/month",
      features: [
        { text: "100+ passages", correct: true },
        { text: "Daily progress tracking", correct: true },
        { text: "Keystroke and Accuracy count", correct: true },
        { text: "Weekly progress tracking", correct: true },
        { text: "Monthly progress tracking", correct: true },
        // Include incorrect features as needed
        // { text: 'Feature not included', correct: false },
      ],
      button_text: "Pay Now",
    },
    {
      title: "Standard English",
      price: "99",
      currency: "₹",
      month: "/month",
      features: [
        { text: "100+ passages", correct: true },
        { text: "Daily progress tracking", correct: true },
        { text: "Keystroke and Accuracy count", correct: true },
        { text: "Weekly progress tracking", correct: true },
        { text: "Monthly progress tracking", correct: true },
        // Include incorrect features as needed
        // { text: 'Feature not included', correct: false },
      ],
      button_text: "Pay Now",
    },
    {
      title: "Standard English",
      price: "99",
      currency: "₹",
      month: "/month",
      features: [
        { text: "100+ passages", correct: true },
        { text: "Daily progress tracking", correct: true },
        { text: "Keystroke and Accuracy count", correct: true },
        { text: "Weekly progress tracking", correct: true },
        { text: "Monthly progress tracking", correct: true },
        // Include incorrect features as needed
        // { text: 'Feature not included', correct: false },
      ],
      button_text: "Pay Now",
    },
  ];

  return (
    <div className="px-5 py-10">
      <div className="flex flex-wrap -mx-4 justify-center">
        {cards.map((card, index) => (
          <div key={index} className="p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <PriceCard {...card} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
