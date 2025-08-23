import { createRouter } from "../../core/router";
import { getPropertiesController } from "./properties.controller";

export default createRouter("/properties", getPropertiesController);
