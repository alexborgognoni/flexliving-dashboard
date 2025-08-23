import { getData } from '../../core/service';
import { Host } from '../../core/types';

export const getHosts = (query: any) => {
    return getData<Host>('hosts', query);
}