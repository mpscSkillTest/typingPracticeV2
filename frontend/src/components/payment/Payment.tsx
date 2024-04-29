import { useState, useEffect } from "react";
import { Icons } from "../ui/icons";
import type { Product } from "../../types";
import axios from "../../config/customAxios";
import PriceCard from "./priceCard/PriceCard";

const App = () => {
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const getAvailableProductDetails = async () => {
    let availableProductsClone = [];
    setIsDetailsLoading(true);
    try {
      const response = await axios.post("/subscriptions/products/");
      if (!response?.data?.products) {
        throw new Error("No Products Available");
      }
      availableProductsClone = response?.data?.products || [];
    } catch (error: unknown) {
      availableProductsClone = [];
      const errorMessage = error?.response?.data?.error || "Something wrong";
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: errorMessage,
        className: "my-[10px]",
      });
    } finally {
      setIsDetailsLoading(false);
    }
    return availableProductsClone;
  };

  const fetchDetails = async () => {
    const updatedProducts: Product[] = await getAvailableProductDetails();
    setAvailableProducts(updatedProducts);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (isDetailsLoading) {
    <div className="flex justify-center items-center h-full">
      <Icons.spinner />
    </div>;
  }

  return (
    <div className="px-5 py-10">
      <div className="flex flex-wrap">
        {availableProducts.map((productDetails, index) => (
          <div key={index} className="p-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
            <PriceCard {...productDetails} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
