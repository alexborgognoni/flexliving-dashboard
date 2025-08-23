
import { getData } from '../../core/service';
import { Review } from '../../core/types';
import { getHostawayReviews } from './hostaway.service';

export const getReviews = async (query: any) => {
    const hostawayReviews = await getHostawayReviews();

    // For now, we are only using hostaway reviews.
    // In the future, we can merge reviews from other sources here.
    const allReviews = [...hostawayReviews];

    // The rest of the function is to apply sorting, filtering and pagination
    const { sortBy, order = 'asc', limit = 10, offset = 0, ...filters } = query;

    let filteredData = allReviews;

    if (Object.keys(filters).length > 0) {
        filteredData = filteredData.filter((item: any) => {
            for (const key in filters) {
                if (item[key] !== filters[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    if (sortBy) {
        filteredData.sort((a: any, b: any) => {
            if (a[sortBy] < b[sortBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const totalCount = filteredData.length;
    const paginatedData = filteredData.slice(offset, offset + limit);

    return {
        status: 'success',
        data: paginatedData,
        meta: {
            totalCount,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: (parseInt(offset) + parseInt(limit)) < totalCount,
            sortBy,
            order,
            filters
        }
    };
}

export const getReviewById = async (id: string) => {
    const hostawayReviews = await getHostawayReviews();
    const allReviews = [...hostawayReviews];
    
    const review = allReviews.find(r => r.id === id);
    return {
        status: 'success',
        data: review
    }
}
