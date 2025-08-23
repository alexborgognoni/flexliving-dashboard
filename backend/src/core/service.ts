
import fs from 'fs/promises';
import path from 'path';

export const getData = async <T>(entityName: string, query: any): Promise<{ status: string; data: T[]; meta: any; }> => {
    const { sortBy, order = 'asc', limit = 10, offset = 0, ...filters } = query;

    const dataPath = path.join(__dirname, 'data', `${entityName}.json`);
    const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

    let filteredData = data;

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
};
