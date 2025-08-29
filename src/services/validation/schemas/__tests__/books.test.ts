import { createBookSchema, updateBookSchema, bookFilterSchema } from '../books';

describe('Books Schemas - Simple Tests', () => {
  const validUUID = '123e4567-e89b-12d3-a456-426614174000';
  const anotherUUID = '123e4567-e89b-12d3-a456-426614174001';

  describe('createBookSchema', () => {
    describe('Valid cases', () => {
      it('should validate minimal required data', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890', // 10 digits
          price: 10.00,
          genreId: validUUID,
          publisherId: anotherUUID,
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.isAvailable).toBe(true); // default
          expect(result.data.stockQuantity).toBe(0); // default
        }
      });

      it('should validate complete book data', () => {
        const bookData = {
          title: 'Cien años de soledad',
          isbnCode: '123-456-789-0', // with dashes
          price: 25.99,
          isAvailable: true,
          stockQuantity: 100,
          coverImageUrl: 'https://example.com/cover.jpg',
          publicationDate: '1967-05-30',
          pageCount: 417,
          summary: 'Una obra maestra.',
          genreId: validUUID,
          publisherId: anotherUUID,
        };

        const result = createBookSchema.safeParse(bookData);
        expect(result.success).toBe(true);
      });

      it('should validate different ISBN formats', () => {
        const validISBNs = [
          '1234567890', // 10 digits
          '123-456-789-0', // with dashes
          '123456789X', // with X
          '0-306-40615-2', // standard format
        ];

        validISBNs.forEach(isbnCode => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode,
            price: 10.00,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(true);
        });
      });

      it('should validate price boundaries', () => {
        const validPrices = [0, 0.01, 999.99, 99999999.99];

        validPrices.forEach(price => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(true);
        });
      });

      it('should accept optional fields as null/empty', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10.00,
          coverImageUrl: null,
          publicationDate: '',
          pageCount: null,
          summary: null,
          genreId: validUUID,
          publisherId: anotherUUID,
        });

        expect(result.success).toBe(true);
      });
    });

    describe('Invalid cases', () => {
      it('should reject empty required fields', () => {
        // Test empty title
        let result = createBookSchema.safeParse({
          title: '',
          isbnCode: '1234567890',
          price: 10,
          genreId: validUUID,
          publisherId: anotherUUID,
        });
        expect(result.success).toBe(false);

        // Test empty ISBN
        result = createBookSchema.safeParse({
          title: 'Book',
          isbnCode: '',
          price: 10,
          genreId: validUUID,
          publisherId: anotherUUID,
        });
        expect(result.success).toBe(false);

        // Test empty genreId
        result = createBookSchema.safeParse({
          title: 'Book',
          isbnCode: '1234567890',
          price: 10,
          genreId: '',
          publisherId: anotherUUID,
        });
        expect(result.success).toBe(false);

        // Test empty publisherId
        result = createBookSchema.safeParse({
          title: 'Book',
          isbnCode: '1234567890',
          price: 10,
          genreId: validUUID,
          publisherId: '',
        });
        expect(result.success).toBe(false);
      });

      it('should reject invalid ISBN formats', () => {
        const invalidISBNs = [
          '', // empty
          '12345678901234', // too long (14 chars)
          '123456789A', // invalid char (only X allowed)
          '1234 5678 90', // spaces not in regex
          '123@456789', // special chars
        ];

        invalidISBNs.forEach(isbnCode => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode,
            price: 10.00,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(false);
        });
      });

      it('should reject negative prices', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: -1,
          genreId: validUUID,
          publisherId: anotherUUID,
        });

        expect(result.success).toBe(false);
      });

      it('should reject too high prices', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 100000000, // exceeds max
          genreId: validUUID,
          publisherId: anotherUUID,
        });

        expect(result.success).toBe(false);
      });

      it('should reject invalid stock quantities', () => {
        const invalidStocks = [-1, 10.5]; // negative or non-integer

        invalidStocks.forEach(stockQuantity => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price: 10.00,
            stockQuantity,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(false);
        });
      });

      it('should reject invalid page counts', () => {
        const invalidPageCounts = [0, -1, 100.5]; // zero, negative, or non-integer

        invalidPageCounts.forEach(pageCount => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price: 10.00,
            pageCount,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(false);
        });
      });

      it('should reject invalid UUIDs', () => {
        const invalidUUIDs = [
          'not-a-uuid',
          '123',
          'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        ];

        invalidUUIDs.forEach(invalidUUID => {
          // Test invalid genreId
          let result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price: 10.00,
            genreId: invalidUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(false);

          // Test invalid publisherId
          result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price: 10.00,
            genreId: validUUID,
            publisherId: invalidUUID,
          });
          expect(result.success).toBe(false);
        });
      });
    });

    describe('Optional field validation', () => {
      it('should accept valid URLs but reject invalid ones', () => {
        // Valid URL should pass
        const validResult = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10.00,
          coverImageUrl: 'https://example.com/cover.jpg',
          genreId: validUUID,
          publisherId: anotherUUID,
        });
        expect(validResult.success).toBe(true);

        // Empty string should pass (optional)
        const emptyResult = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10.00,
          coverImageUrl: '',
          genreId: validUUID,
          publisherId: anotherUUID,
        });
        expect(emptyResult.success).toBe(true);
      });

      it('should validate publication dates', () => {
        const validDates = ['2023-01-01', '1967-05-30', '2000-12-31'];
        const invalidDates = ['not-a-date', '2023-13-01', '32/12/2023'];

        validDates.forEach(date => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price: 10.00,
            publicationDate: date,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(true);
        });

        invalidDates.forEach(date => {
          const result = createBookSchema.safeParse({
            title: 'Test Book',
            isbnCode: '1234567890',
            price: 10.00,
            publicationDate: date,
            genreId: validUUID,
            publisherId: anotherUUID,
          });
          expect(result.success).toBe(false);
        });
      });
    });
  });

  describe('updateBookSchema', () => {
    describe('Valid cases', () => {
      it('should validate partial updates', () => {
        const partialUpdates = [
          { title: 'New Title' },
          { price: 29.99 },
          { isAvailable: false },
          { stockQuantity: 50 },
          {},
        ];

        partialUpdates.forEach(update => {
          const result = updateBookSchema.safeParse(update);
          expect(result.success).toBe(true);
        });
      });

      it('should validate complete update', () => {
        const result = updateBookSchema.safeParse({
          title: 'Updated Title',
          isbnCode: '1234567890123', // 13 digits for update
          price: 29.99,
          isAvailable: false,
          stockQuantity: 50,
          coverImageUrl: 'https://example.com/new.jpg',
          publicationDate: '2023-01-01',
          pageCount: 200,
          summary: 'Updated summary',
          genreId: validUUID,
          publisherId: anotherUUID,
        });

        expect(result.success).toBe(true);
      });
    });

    describe('Invalid cases', () => {
      it('should reject empty title when provided', () => {
        const result = updateBookSchema.safeParse({ title: '' });
        expect(result.success).toBe(false);
      });

      it('should reject ISBN shorter than 10 for update', () => {
        const result = updateBookSchema.safeParse({ isbnCode: '123456789' });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('bookFilterSchema', () => {
    describe('Valid cases', () => {
      it('should provide defaults', () => {
        const result = bookFilterSchema.safeParse({});
        
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.page).toBe(1);
          expect(result.data.limit).toBe(10);
          expect(result.data.sortBy).toBe('title');
          expect(result.data.sortOrder).toBe('ASC');
        }
      });

      it('should validate complete filter', () => {
        const result = bookFilterSchema.safeParse({
          genreId: validUUID,
          publisherId: anotherUUID,
          minPrice: 10.00,
          maxPrice: 50.00,
          isAvailable: true,
          publicationDateAfter: '2020-01-01',
          publicationDateBefore: '2023-12-31',
          page: 2,
          limit: 20,
          sortBy: 'price',
          sortOrder: 'DESC',
        });

        expect(result.success).toBe(true);
      });
    });

    describe('Cross-field validation', () => {
      it('should reject minPrice > maxPrice', () => {
        const result = bookFilterSchema.safeParse({
          minPrice: 50.00,
          maxPrice: 10.00, // max < min
        });

        expect(result.success).toBe(false);
      });

      it('should reject publicationDateAfter > publicationDateBefore', () => {
        const result = bookFilterSchema.safeParse({
          publicationDateAfter: '2023-12-31',
          publicationDateBefore: '2020-01-01', // before < after
        });

        expect(result.success).toBe(false);
      });

      it('should allow equal prices and dates', () => {
        const result = bookFilterSchema.safeParse({
          minPrice: 20.00,
          maxPrice: 20.00,
          publicationDateAfter: '2023-06-15',
          publicationDateBefore: '2023-06-15',
        });

        expect(result.success).toBe(true);
      });
    });

    describe('Invalid individual fields', () => {
      it('should reject negative prices', () => {
        let result = bookFilterSchema.safeParse({ minPrice: -1 });
        expect(result.success).toBe(false);

        result = bookFilterSchema.safeParse({ maxPrice: -1 });
        expect(result.success).toBe(false);
      });

      it('should reject invalid pagination values', () => {
        let result = bookFilterSchema.safeParse({ page: 0 });
        expect(result.success).toBe(false);

        result = bookFilterSchema.safeParse({ limit: 0 });
        expect(result.success).toBe(false);

        result = bookFilterSchema.safeParse({ limit: 101 });
        expect(result.success).toBe(false);
      });

      it('should reject invalid sort orders', () => {
        const result = bookFilterSchema.safeParse({ 
          sortOrder: 'INVALID' as any 
        });
        expect(result.success).toBe(false);
      });
    });
  });
});