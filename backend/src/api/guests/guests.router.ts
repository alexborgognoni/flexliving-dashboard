import { createRouter } from '../../core/router';
import { getGuestsController } from './guests.controller';

export default createRouter(getGuestsController);