import { createRouter } from '../../core/router';
import { getHostsController } from './hosts.controller';

export default createRouter(getHostsController);