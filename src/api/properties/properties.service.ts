import { getData } from '../../core/service';
import { Property } from '../../core/types';

export const getProperties = (query: any) => {
    return getData<Property>('properties', query);
}