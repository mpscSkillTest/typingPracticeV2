import { Router } from "express";
import { newSubscriptionSchema } from "../schema/subscription.schema.js";
import {
  getProducts,
  addNewSubscriptionDetails,
} from "../controllers/index.js";
import { validateFormData } from "../middlewares/index.js";

const SubscriptionRouter = Router();

SubscriptionRouter.post("/products", getProducts);

SubscriptionRouter.post(
  "/subscribe",
  validateFormData(newSubscriptionSchema),
  addNewSubscriptionDetails
);

export default SubscriptionRouter;
