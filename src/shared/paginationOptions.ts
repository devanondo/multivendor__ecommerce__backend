export const paginationQueryOptions = ['page', 'limit', 'sortBy', 'sortOrder'];

export type IPaginationOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};
