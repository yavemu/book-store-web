export const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

export const mockApiResponse = {
  success: (data: any) => Promise.resolve(data),
  error: (error: any) => Promise.reject(error),
  pagination: (data: any[], page = 1, limit = 10) => ({
    data,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit,
      hasNextPage: page * limit < data.length,
      hasPrevPage: page > 1,
    },
  }),
};

// Mock data for different entities
export const mockInventoryMovements = [
  {
    id: 'INV-001',
    type: 'IN',
    status: 'COMPLETED',
    quantity: 10,
    bookId: 'book-1',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:30:00Z',
  },
  {
    id: 'INV-002',
    type: 'OUT',
    status: 'PENDING',
    quantity: 5,
    bookId: 'book-2',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
  },
];

export const mockBooks = [
  {
    id: 'book-1',
    title: 'Test Book 1',
    isbn: '978-1234567890',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'book-2',
    title: 'Test Book 2',
    isbn: '978-0987654321',
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
  },
];

// Mock fetch globally
global.fetch = jest.fn();

export const mockFetchResponse = (data: any, ok = true, status = 200) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(data),
    headers: {
      get: () => 'application/json',
    },
  });
};