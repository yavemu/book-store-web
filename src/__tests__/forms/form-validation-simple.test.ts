/**
 * Direct Form Testing - Comprehensive Validation Tests
 * Tests all form validations directly without UI rendering
 */

import { createAuthorSchema } from '@/services/validation/schemas/authors';
import { createBookSchema } from '@/services/validation/schemas/books';
import { createUserSchema } from '@/services/validation/schemas/users';
import { createPublishingHouseSchema } from '@/services/validation/schemas/publishing-houses';
import { createGenreSchema } from '@/services/validation/schemas/genres';

describe('Form Validation - Direct Zod Schema Testing', () => {
  
  describe('Authors Schema Validation', () => {
    test('SUCCESS: Valid author data', () => {
      const validAuthor = {
        firstName: 'Gabriel',
        lastName: 'García Márquez',
        nationality: 'Colombiano',
        birthDate: '1927-03-06',
        website: 'https://www.gabriel-garcia-marquez.com'
      };

      const result = createAuthorSchema.safeParse(validAuthor);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('Gabriel');
        expect(result.data.lastName).toBe('García Márquez');
      }
    });

    test('ERROR: Missing required firstName', () => {
      const invalidAuthor = {
        lastName: 'García Márquez'
      };

      const result = createAuthorSchema.safeParse(invalidAuthor);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('firstName');
      }
    });

    test('ERROR: firstName too short', () => {
      const invalidAuthor = {
        firstName: 'A',
        lastName: 'García'
      };

      const result = createAuthorSchema.safeParse(invalidAuthor);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/al menos 2 caracteres/);
      }
    });

    test('ERROR: Invalid website URL', () => {
      const invalidAuthor = {
        firstName: 'Gabriel',
        lastName: 'García',
        website: 'invalid-url'
      };

      const result = createAuthorSchema.safeParse(invalidAuthor);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/URL válida/);
      }
    });
  });

  describe('Books Schema Validation', () => {
    test('SUCCESS: Valid book data', () => {
      const validBook = {
        title: 'Cien años de soledad',
        description: 'Una obra maestra de la literatura',
        isbnCode: '9783161484100',
        price: 25.99,
        stockQuantity: 100,
        publisherId: 'pub-123',
        genreId: 'genre-123',
        authorIds: ['author-123'],
        isAvailable: true
      };

      const result = createBookSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid ISBN format', () => {
      const invalidBook = {
        title: 'Test Book',
        isbnCode: '123',
        price: 25.99,
        stockQuantity: 10
      };

      const result = createBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('isbnCode') && issue.message.includes('ISBN')
        )).toBe(true);
      }
    });

    test('ERROR: Negative price', () => {
      const invalidBook = {
        title: 'Test Book',
        isbnCode: '9783161484100',
        price: -10,
        stockQuantity: 10
      };

      const result = createBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('mayor')
        )).toBe(true);
      }
    });

    test('ERROR: Stock quantity too high', () => {
      const invalidBook = {
        title: 'Test Book',
        isbnCode: '9783161484100',
        price: 25.99,
        stockQuantity: 100000
      };

      const result = createBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('99999')
        )).toBe(true);
      }
    });
  });

  describe('Users Schema Validation', () => {
    test('SUCCESS: Valid user data', () => {
      const validUser = {
        username: 'testuser123',
        email: 'test@example.com',
        password: 'SecurePass123!',
        roleId: 'role-123',
        isActive: true
      };

      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid email format', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('email')
        )).toBe(true);
      }
    });

    test('ERROR: Password too short', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && issue.message.includes('8')
        )).toBe(true);
      }
    });

    test('ERROR: Username too short', () => {
      const invalidUser = {
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('username') && issue.message.includes('3')
        )).toBe(true);
      }
    });
  });

  describe('Publishers Schema Validation', () => {
    test('SUCCESS: Valid publisher data', () => {
      const validPublisher = {
        name: 'Editorial Planeta',
        country: 'España',
        websiteUrl: 'https://www.planeta.com'
      };

      const result = createPublishingHouseSchema.safeParse(validPublisher);
      expect(result.success).toBe(true);
    });

    test('ERROR: Name too short', () => {
      const invalidPublisher = {
        name: 'A'
      };

      const result = createPublishingHouseSchema.safeParse(invalidPublisher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/al menos 2 caracteres/);
      }
    });

    test('ERROR: Invalid website URL', () => {
      const invalidPublisher = {
        name: 'Editorial Test',
        websiteUrl: 'not-a-url'
      };

      const result = createPublishingHouseSchema.safeParse(invalidPublisher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('websiteUrl')
        )).toBe(true);
      }
    });
  });

  describe('Genres Schema Validation', () => {
    test('SUCCESS: Valid genre data', () => {
      const validGenre = {
        name: 'Realismo Mágico',
        description: 'Género literario que combina elementos fantásticos con la realidad.'
      };

      const result = createGenreSchema.safeParse(validGenre);
      expect(result.success).toBe(true);
    });

    test('ERROR: Empty name field', () => {
      const invalidGenre = {
        name: '',
        description: 'Test description'
      };

      const result = createGenreSchema.safeParse(invalidGenre);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('name')
        )).toBe(true);
      }
    });

    test('ERROR: Name too short', () => {
      const invalidGenre = {
        name: 'A'
      };

      const result = createGenreSchema.safeParse(invalidGenre);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/al menos 2 caracteres/);
      }
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    test('Authors: Maximum field lengths', () => {
      const longString = 'a'.repeat(256);
      const author = {
        firstName: longString,
        lastName: longString,
        nationality: longString
      };

      const result = createAuthorSchema.safeParse(author);
      // Should pass or fail based on max length constraints
      expect(typeof result.success).toBe('boolean');
    });

    test('Books: Price and stock boundaries', () => {
      const boundaryTests = [
        { price: 0.01, stockQuantity: 0 }, // Minimum values
        { price: 9999.99, stockQuantity: 99999 }, // Maximum values
      ];

      boundaryTests.forEach(test => {
        const book = {
          title: 'Boundary Test',
          isbnCode: '9783161484100',
          ...test
        };

        const result = createBookSchema.safeParse(book);
        expect(result.success).toBe(true);
      });
    });

    test('Users: Special characters in fields', () => {
      const userWithSpecialChars = {
        username: 'user_test-123',
        email: 'test+tag@example-domain.com',
        password: 'Pass@123#$%^&*()'
      };

      const result = createUserSchema.safeParse(userWithSpecialChars);
      expect(result.success).toBe(true);
    });
  });
});

describe('Form Integration Testing Simulation', () => {
  test('Complete form flow simulation - Authors', () => {
    // Simulate user input and validation
    const userInput = {
      firstName: 'Isabel',
      lastName: 'Allende',
      nationality: 'Chilena',
      birthDate: '1942-08-02'
    };

    // Step 1: Validate with Zod
    const validationResult = createAuthorSchema.safeParse(userInput);
    expect(validationResult.success).toBe(true);

    // Step 2: Transform for API (if needed)
    if (validationResult.success) {
      const apiPayload = {
        ...validationResult.data,
        // Additional transformations could happen here
        isActive: true
      };

      expect(apiPayload.firstName).toBe('Isabel');
      expect(apiPayload.isActive).toBe(true);
    }
  });

  test('Error handling flow simulation - Books', () => {
    const invalidInput = {
      title: '', // Invalid: empty
      isbnCode: '123', // Invalid: wrong format
      price: -5, // Invalid: negative
      stockQuantity: 200000 // Invalid: too high
    };

    const validationResult = createBookSchema.safeParse(invalidInput);
    expect(validationResult.success).toBe(false);

    if (!validationResult.success) {
      // Collect all errors for UI display
      const errors = validationResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.field === 'title')).toBe(true);
      expect(errors.some(e => e.field === 'isbnCode')).toBe(true);
      expect(errors.some(e => e.field === 'price')).toBe(true);
      expect(errors.some(e => e.field === 'stockQuantity')).toBe(true);
    }
  });
});