import { createRouter } from "../../core/router";
import { getReviewsController, getReviewByIdController } from "./reviews.controller";

export default createRouter("/reviews", getReviewsController, getReviewByIdController);
