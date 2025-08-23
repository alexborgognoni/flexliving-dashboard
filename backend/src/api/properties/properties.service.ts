
import { getData } from '../../core/service';
import { Property } from '../../core/types';

export const getProperties = (query: any) => {
    return getData<Property>('properties', query);
}

export const getPropertyById = async (id: string) => {
    const properties = await getData<Property>('properties', {});
    const property = properties.data.find(p => p.id === id);
    return {
        status: 'success',
        data: property
    }
}
