import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { COMPANY_URL } from "../../../utils/constant";
import { loadRazorpayScript } from "../../../utils/razorpay";
import axios from "../../../config/customAxios";
import type { Product } from "../../../types";

type RazorpayResponse = {
  razorpay_payment_id: string;
};

// on success store user id, product id, start date and end date, next billing date based and number of times subscription updated

const PriceCard = ({ title, price, features, type, productId }: Product) => {
  const isFreePlan = type === "FREE";
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addNewSubscription = async (transactionId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/subscriptions/subscribe/", {
        productId,
        transactionId,
        amount: price,
      });
      const { data } = response || {};
      const { subscriptionId, paymentId, nextBillingDate } = data || {};

      if (!subscriptionId || !paymentId || !nextBillingDate) {
        throw new Error(
          "Subscription Operation failed. Please retry or contact us"
        );
      }
      toast({
        title: "New Subscription Added",
        description: `Your next billing date is ${nextBillingDate}`,
        className: "my-[10px]",
      });
      return;
    } catch (error: unknown) {
      console.error({ error });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description:
          "Subscription Operation failed. Please retry or contact us",
        className: "my-[10px]",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // To handle a payment
  const handlePayment = async () => {
    // Dynamically load the Razorpay script so that we can create an instance of Razorpay
    const res = await loadRazorpayScript();

    if (!res) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Check your connection or try again",
      });
      return;
    }

    const options = {
      key: "rzp_test_FTcWVtO6GaHFlO", // Replace with your key_id from Razorpay Dashboard
      amount: price * 100, // Amount is in smallest currency unit. Here, 50000 paise = 500 INR
      currency: "INR",
      name: "Web Touter",
      description: "Typing test Payment",
      image: COMPANY_URL,
      handler: (response: RazorpayResponse) => {
        // Payment was successful, you can use the response object to handle the payment confirmation
        console.info(
          `Payment successful! Payment ID: ${response.razorpay_payment_id}`
        );
        addNewSubscription(response?.razorpay_payment_id);
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

  return (
    <Card key={productId} className="flex flex-col h-full rounded-md">
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-wrap h-max gap-[10px] p-3 items-center justify-between">
        {!isFreePlan ? (
          <div className="flex items-baseline mx-auto my-[10px]">
            <span className="text-3xl font-bold">₹</span>
            <span className="text-4xl font-bold ml-1">{price}</span>
            <span className="text-xl text-gray-500 ml-1">/month</span>
          </div>
        ) : null}
        <ul className="flex-grow mb-6 w-full ms-4 ">
          {features.map((feature, index) => (
            <li key={index} className="mb-3 flex items-center">
              <span className="text-sm text-gray-700 flex items-baseline">
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
      </CardContent>
      <CardFooter>
        {!isFreePlan ? (
          <Button
            className="text-center w-full justify-self-center"
            onClick={handlePayment}
            showLoader={isLoading}
          >
            Buy Now
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default PriceCard;
