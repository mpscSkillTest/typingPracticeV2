import { StatusCodes } from "http-status-codes";
import { supabase } from "../../dbClient.js";
import { PRODUCT_DB_NAME, FEATURE_DETAILS } from "../../constant.js";
import logger from "../../utils/logger.js";

export const getProducts = async (req, res) => {
  logger.info("Checking the getProducts status: Everything is OK");
  try {
    const { data, error } = await supabase
      .from(PRODUCT_DB_NAME)
      .select(
        `
    id,
    name,
    price,
    product_type
  `
      )
      .order("id");

    if (error) {
      logger.error(
        "Checking the getProducts status: Encountered error in product details retrieval"
      );
      throw new Error(error?.message);
    }

    const parsedProducts = data?.map?.((productDetails) => {
      const { price, product_type, name, id } = productDetails || {};

      const features = FEATURE_DETAILS[product_type]?.features;

      return {
        title: name,
        features,
        price,
        productId: id,
        type: product_type,
      };
    });

    logger.info(
      "Checking the getProducts status: Fetched product details",
      parsedProducts
    );
    res.status(StatusCodes.OK).send({
      products: parsedProducts,
      error: null,
    });
    return;
  } catch (error) {
    logger.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ products: [], error: "No Products available" });
    return;
  }
  return;
};
