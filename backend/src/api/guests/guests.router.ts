import { createRouter } from "../../core/router";
import { getGuestsController, getGuestByIdController } from "./guests.controller";

export default createRouter("/guests", getGuestsController, getGuestByIdController);
