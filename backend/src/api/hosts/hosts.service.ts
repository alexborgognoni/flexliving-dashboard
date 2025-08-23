import { getData } from '../../core/service';
import { Host } from '../../core/types';

export const getHosts = (query: any) => {
    return getData<Host>('hosts', query);
}

export const getHostById = async (id: string) => {
    const hosts = await getData<Host>('hosts', {});
    const host = hosts.data.find(h => h.id === id);
    return {
        status: 'success',
        data: host
    }
}