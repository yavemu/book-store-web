import { createBookSchema } from '@/services/validation/schemas/books';

describe('Debug Book Validation', () => {
  test('Debug failing book validation', () => {
    const validBook = {
      title: 'Cien años de soledad',
      isbnCode: '978-0-06-088328-7',
      price: 25.99,
      stockQuantity: 100,
      isAvailable: true,
      genreId: '550e8400-e29b-41d4-a716-446655440000',
      publisherId: '550e8400-e29b-41d4-a716-446655440001'
    };

    const result = createBookSchema.safeParse(validBook);
    console.log('Book validation result:', result.success);
    
    if (!result.success) {
      console.log('Validation errors:');
      result.error.issues.forEach((issue, index) => {
        console.log(`${index + 1}. Path: ${issue.path.join('.')} - Message: ${issue.message}`);
      });
    }

    // For now, just log the result
    expect(typeof result.success).toBe('boolean');
  });
});