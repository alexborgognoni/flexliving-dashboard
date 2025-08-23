
import fs from 'fs/promises';
import path from 'path';
import { normalizeHostawayReview } from '../../core/normalizers/hostaway.normalizer';
import { Property, Host, Guest } from '../../core/types';

export const getHostawayReviews = async () => {
    const dataPath = path.join(__dirname, '../../core/data', 'hostaway.json');
    const hostawayData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    const propertiesPath = path.join(__dirname, '../../core/data', 'properties.json');
    const properties: Property[] = JSON.parse(await fs.readFile(propertiesPath, 'utf-8'));

    const hostsPath = path.join(__dirname, '../../core/data', 'hosts.json');
    const hosts: Host[] = JSON.parse(await fs.readFile(hostsPath, 'utf-8'));

    const guestsPath = path.join(__dirname, '../../core/data', 'guests.json');
    const guests: Guest[] = JSON.parse(await fs.readFile(guestsPath, 'utf-8'));

    return hostawayData.result.map((review: any) => normalizeHostawayReview(review, properties, hosts, guests));
};
