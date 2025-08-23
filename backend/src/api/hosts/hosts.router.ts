import { createRouter } from "../../core/router";
import { getHostsController, getHostByIdController } from "./hosts.controller";

export default createRouter("/hosts", getHostsController, getHostByIdController);
