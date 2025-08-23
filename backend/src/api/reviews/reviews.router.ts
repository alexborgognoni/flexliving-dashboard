import { createRouter } from "../../core/router";
import { getReviewsController } from "./reviews.controller";

export default createRouter("/reviews", getReviewsController);
