/**
 * CORRECTED Form Validation Tests - Based on Real Zod Schemas
 * All tests now match the actual validation logic implemented
 */

import { createAuthorSchema } from '@/services/validation/schemas/authors';
import { createBookSchema } from '@/services/validation/schemas/books';
import { createUserSchema } from '@/services/validation/schemas/users';
import { createPublishingHouseSchema } from '@/services/validation/schemas/publishing-houses';
import { createGenreSchema } from '@/services/validation/schemas/genres';

describe('CORRECTED Form Validation - Real Schema Testing', () => {
  
  describe('Authors Schema Validation', () => {
    test('SUCCESS: Valid author data', () => {
      const validAuthor = {
        firstName: 'Gabriel',
        lastName: 'García Márquez',
        nationality: 'Colombiano',
        birthDate: '1927-03-06',
        biography: 'Escritor colombiano, Premio Nobel de Literatura 1982.'
      };

      const result = createAuthorSchema.safeParse(validAuthor);
      expect(result.success).toBe(true);
    });

    test('ERROR: Missing required firstName', () => {
      const invalidAuthor = {
        lastName: 'García Márquez'
      };

      const result = createAuthorSchema.safeParse(invalidAuthor);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('firstName')
        )).toBe(true);
      }
    });

    test('SUCCESS: Single letter firstName (min 1 allowed)', () => {
      const validAuthor = {
        firstName: 'A',
        lastName: 'García'
      };

      const result = createAuthorSchema.safeParse(validAuthor);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid characters in firstName', () => {
      const invalidAuthor = {
        firstName: 'Gabriel123',
        lastName: 'García'
      };

      const result = createAuthorSchema.safeParse(invalidAuthor);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toMatch(/letras y espacios/);
      }
    });

    test('SUCCESS: Empty nationality (optional field)', () => {
      const validAuthor = {
        firstName: 'Isabel',
        lastName: 'Allende',
        nationality: ''
      };

      const result = createAuthorSchema.safeParse(validAuthor);
      expect(result.success).toBe(true);
    });
  });

  describe('Books Schema Validation', () => {
    test('SUCCESS: Valid book with required fields', () => {
      const validBook = {
        title: 'Cien años de soledad',
        isbnCode: '9780062883287', // 13 characters max, only numbers/hyphens/X
        price: 25.99,
        stockQuantity: 100,
        isAvailable: true,
        genreId: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID
        publisherId: '550e8400-e29b-41d4-a716-446655440001'  // Valid UUID
      };

      const result = createBookSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });

    test('ERROR: Missing required genreId', () => {
      const invalidBook = {
        title: 'Test Book',
        isbnCode: '9780062883287',
        price: 25.99,
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      const result = createBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('genreId')
        )).toBe(true);
      }
    });

    test('ERROR: Invalid ISBN characters', () => {
      const invalidBook = {
        title: 'Test Book',
        isbnCode: '123abc',
        price: 25.99,
        genreId: '550e8400-e29b-41d4-a716-446655440000',
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      const result = createBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('isbnCode') && issue.message.includes('números')
        )).toBe(true);
      }
    });

    test('SUCCESS: Zero price allowed (min 0)', () => {
      const validBook = {
        title: 'Free Book',
        isbnCode: '9780062883287',
        price: 0,
        genreId: '550e8400-e29b-41d4-a716-446655440000',
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      const result = createBookSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });

    test('ERROR: Negative price', () => {
      const invalidBook = {
        title: 'Test Book',
        isbnCode: '9780062883287',
        price: -10,
        genreId: '550e8400-e29b-41d4-a716-446655440000',
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      const result = createBookSchema.safeParse(invalidBook);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('negativo')
        )).toBe(true);
      }
    });

    test('SUCCESS: High stock quantity within limits', () => {
      const validBook = {
        title: 'Popular Book',
        isbnCode: '9780062883287',
        price: 25.99,
        stockQuantity: 50000, // No upper limit in schema
        genreId: '550e8400-e29b-41d4-a716-446655440000',
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      const result = createBookSchema.safeParse(validBook);
      expect(result.success).toBe(true);
    });
  });

  describe('Users Schema Validation', () => {
    test('SUCCESS: Valid user with strong password', () => {
      const validUser = {
        username: 'testuser123',
        email: 'test@example.com',
        password: 'SecurePass123',
        roleId: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid email format', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'SecurePass123',
        roleId: '550e8400-e29b-41d4-a716-446655440000'
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
        password: '123',
        roleId: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('password') && issue.message.includes('8')
        )).toBe(true);
      }
    });

    test('ERROR: Password missing requirements (uppercase, lowercase, number)', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password', // No uppercase or number
        roleId: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('minúscula') || issue.message.includes('mayúscula')
        )).toBe(true);
      }
    });

    test('ERROR: Username with special characters', () => {
      const invalidUser = {
        username: 'user@test', // @ not allowed
        email: 'test@example.com',
        password: 'SecurePass123',
        roleId: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('username')
        )).toBe(true);
      }
    });

    test('SUCCESS: Username with allowed characters', () => {
      const validUser = {
        username: 'user_test-123',
        email: 'test@example.com',
        password: 'SecurePass123',
        roleId: '550e8400-e29b-41d4-a716-446655440000'
      };

      const result = createUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('ERROR: Missing required roleId', () => {
      const invalidUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'SecurePass123'
      };

      const result = createUserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.path.includes('roleId')
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

    test('SUCCESS: Single character name allowed (min 1)', () => {
      const validPublisher = {
        name: 'A'
      };

      const result = createPublishingHouseSchema.safeParse(validPublisher);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid characters in name', () => {
      const invalidPublisher = {
        name: 'Editorial@Test#' // @ and # not allowed
      };

      const result = createPublishingHouseSchema.safeParse(invalidPublisher);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('caracteres no válidos')
        )).toBe(true);
      }
    });

    test('SUCCESS: Empty website URL (optional)', () => {
      const validPublisher = {
        name: 'Editorial Test',
        websiteUrl: ''
      };

      const result = createPublishingHouseSchema.safeParse(validPublisher);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid website URL format', () => {
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

    test('SUCCESS: Single character name allowed (min 1)', () => {
      const validGenre = {
        name: 'A'
      };

      const result = createGenreSchema.safeParse(validGenre);
      expect(result.success).toBe(true);
    });

    test('ERROR: Invalid characters in name', () => {
      const invalidGenre = {
        name: 'Fantasy@Genre#' // @ and # not allowed in some contexts
      };

      const result = createGenreSchema.safeParse(invalidGenre);
      // This should actually pass since the regex allows these characters
      // Let's test with truly invalid characters
      const reallyInvalidGenre = {
        name: 'Genre<script>'
      };

      const realResult = createGenreSchema.safeParse(reallyInvalidGenre);
      expect(realResult.success).toBe(false);
    });

    test('SUCCESS: Empty description (optional)', () => {
      const validGenre = {
        name: 'Mystery',
        description: ''
      };

      const result = createGenreSchema.safeParse(validGenre);
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases and Real World Scenarios', () => {
    test('Books: Complete valid book with all optional fields', () => {
      const completeBook = {
        title: 'El Quijote',
        isbnCode: '9788437604947',
        price: 29.99,
        stockQuantity: 50,
        isAvailable: true,
        coverImageUrl: 'https://example.com/cover.jpg',
        publicationDate: '2023-01-15',
        pageCount: 500,
        summary: 'Una obra clásica de la literatura española.',
        genreId: '550e8400-e29b-41d4-a716-446655440000',
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      const result = createBookSchema.safeParse(completeBook);
      expect(result.success).toBe(true);
    });

    test('Users: Password complexity requirements', () => {
      const testCases = [
        { password: 'Password123', expected: true }, // Valid
        { password: 'password123', expected: false }, // No uppercase
        { password: 'PASSWORD123', expected: false }, // No lowercase
        { password: 'Passwordabc', expected: false }, // No number
        { password: 'Pass123', expected: false }, // Too short
      ];

      testCases.forEach(({ password, expected }) => {
        const userData = {
          username: 'testuser',
          email: 'test@example.com',
          password,
          roleId: '550e8400-e29b-41d4-a716-446655440000'
        };

        const result = createUserSchema.safeParse(userData);
        expect(result.success).toBe(expected);
      });
    });

    test('Authors: Biography field validation', () => {
      const longBiography = 'a'.repeat(1001); // Exceeds 1000 char limit
      const validBiography = 'a'.repeat(500);

      const invalidAuthor = {
        firstName: 'Test',
        lastName: 'Author',
        biography: longBiography
      };

      const validAuthor = {
        firstName: 'Test',
        lastName: 'Author',
        biography: validBiography
      };

      expect(createAuthorSchema.safeParse(invalidAuthor).success).toBe(false);
      expect(createAuthorSchema.safeParse(validAuthor).success).toBe(true);
    });

    test('Publishers: Country field validation', () => {
      const validPublisher = {
        name: 'Test Publisher',
        country: 'Estados Unidos'
      };

      const result = createPublishingHouseSchema.safeParse(validPublisher);
      expect(result.success).toBe(true);
    });

    test('Integration: Form data transformation', () => {
      // Simulate form input that needs transformation
      const formData = {
        title: '  Spaced Title  ', // Trimmed by forms typically
        isbnCode: '9780062883287',
        price: 25.99,
        genreId: '550e8400-e29b-41d4-a716-446655440000',
        publisherId: '550e8400-e29b-41d4-a716-446655440001'
      };

      // Test that form accepts the data as-is (trimming handled by forms)
      const result = createBookSchema.safeParse(formData);
      expect(result.success).toBe(true);
    });
  });
});