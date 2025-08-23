import { getData } from '../../core/service';
import { Guest } from '../../core/types';

export const getGuests = (query: any) => {
    return getData<Guest>('guests', query);
}