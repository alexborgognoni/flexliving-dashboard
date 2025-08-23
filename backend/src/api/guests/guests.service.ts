import { getData } from '../../core/service';
import { Guest } from '../../core/types';

export const getGuests = (query: any) => {
    return getData<Guest>('guests', query);
}

export const getGuestById = async (id: string) => {
    const guests = await getData<Guest>('guests', {});
    const guest = guests.data.find(g => g.id === id);
    return {
        status: 'success',
        data: guest
    }
}