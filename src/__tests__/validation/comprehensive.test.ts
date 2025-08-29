import { 
  generateComprehensiveValidationTests,
  testAllEndpoints,
  generateValidBookData,
  generateValidUserData,
  generateValidAuthorData,
  generateValidGenreData,
  generateValidPublishingHouseData,
  generateInvalidBookData,
  generateInvalidUserData
} from '@/utils/testDataGenerator';

import {
  createBookSchema,
  updateBookSchema,
  bookSearchSchema,
  bookFilterSchema
} from '@/services/validation/schemas/books';

import {
  createUserSchema,
  updateUserSchema,
  userSearchSchema,
  changePasswordSchema
} from '@/services/validation/schemas/users';

import {
  createAuthorSchema,
  updateAuthorSchema,
  authorSearchSchema,
  bookAuthorAssignmentSchema
} from '@/services/validation/schemas/authors';

import {
  createGenreSchema,
  updateGenreSchema,
  genreSearchSchema
} from '@/services/validation/schemas/genres';

import {
  createPublishingHouseSchema,
  updatePublishingHouseSchema,
  publishingHouseSearchSchema
} from '@/services/validation/schemas/publishing-houses';

describe('Comprehensive Validation Tests', () => {
  describe('Book Validation Tests', () => {
    describe('createBookSchema - Required Fields', () => {
      it('should reject missing title', () => {
        const result = createBookSchema.safeParse({
          isbnCode: '1234567890',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('título'))).toBe(true);
        }
      });

      it('should reject empty title', () => {
        const result = createBookSchema.safeParse({
          title: '',
          isbnCode: '1234567890',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('título'))).toBe(true);
        }
      });

      it('should reject missing ISBN', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('ISBN'))).toBe(true);
        }
      });

      it('should reject missing price', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing genreId', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('género'))).toBe(true);
        }
      });

      it('should reject missing publisherId', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('editorial'))).toBe(true);
        }
      });
    });

    describe('createBookSchema - Length Validation', () => {
      it('should reject title too long', () => {
        const result = createBookSchema.safeParse({
          title: 'A'.repeat(256),
          isbnCode: '1234567890',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('255 caracteres'))).toBe(true);
        }
      });

      it('should reject ISBN too long', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '12345678901234',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('13 caracteres'))).toBe(true);
        }
      });

      it('should reject cover URL too long', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          coverImageUrl: 'https://example.com/' + 'a'.repeat(500),
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('500 caracteres'))).toBe(true);
        }
      });
    });

    describe('createBookSchema - Format Validation', () => {
      it('should reject invalid ISBN format', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: 'invalid-isbn',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('números, guiones y X'))).toBe(true);
        }
      });

      it('should reject negative price', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: -10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('no puede ser negativo'))).toBe(true);
        }
      });

      it('should reject price too high', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 100000000,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('demasiado alto'))).toBe(true);
        }
      });

      it('should reject invalid genreId UUID', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          genreId: 'invalid-uuid',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('UUID válido'))).toBe(true);
        }
      });

      it('should reject invalid publisherId UUID', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'invalid-uuid'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('UUID válido'))).toBe(true);
        }
      });

      it('should reject invalid cover URL format', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          coverImageUrl: 'not-a-url',
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('URL'))).toBe(true);
        }
      });

      it('should reject invalid publication date', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          publicationDate: 'invalid-date',
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('fecha'))).toBe(true);
        }
      });

      it('should reject negative stock quantity', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          stockQuantity: -1,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('stock no puede ser negativo'))).toBe(true);
        }
      });

      it('should reject invalid page count (zero)', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          pageCount: 0,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('páginas debe ser mayor a 0'))).toBe(true);
        }
      });

      it('should reject invalid page count (negative)', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          pageCount: -10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('páginas debe ser mayor a 0'))).toBe(true);
        }
      });
    });

    describe('createBookSchema - Valid Data', () => {
      it('should accept valid minimal book data', () => {
        const result = createBookSchema.safeParse({
          title: 'Test Book',
          isbnCode: '1234567890',
          price: 10,
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(true);
      });

      it('should accept valid complete book data', () => {
        const result = createBookSchema.safeParse({
          title: 'Complete Test Book',
          isbnCode: '1234567890123',
          price: 29.99,
          stockQuantity: 100,
          coverImageUrl: 'https://example.com/cover.jpg',
          publicationDate: '2024-01-01',
          pageCount: 300,
          summary: 'A comprehensive test book',
          genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
          publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('User Validation Tests', () => {
    describe('createUserSchema - Required Fields', () => {
      it('should reject missing username', () => {
        const result = createUserSchema.safeParse({
          email: 'test@example.com',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('usuario es requerido'))).toBe(true);
        }
      });

      it('should reject missing email', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('email es requerido'))).toBe(true);
        }
      });

      it('should reject missing password', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing roleId', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123'
        });
        expect(result.success).toBe(false);
      });
    });

    describe('createUserSchema - Format Validation', () => {
      it('should reject invalid username characters', () => {
        const result = createUserSchema.safeParse({
          username: 'test user!',
          email: 'test@example.com',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('letras, números, guiones'))).toBe(true);
        }
      });

      it('should reject invalid email format', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'invalid-email',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('email no es válido'))).toBe(true);
        }
      });

      it('should reject short password', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'short',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('8 caracteres'))).toBe(true);
        }
      });

      it('should reject password without uppercase', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('mayúscula'))).toBe(true);
        }
      });

      it('should reject password without lowercase', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'PASSWORD123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('minúscula'))).toBe(true);
        }
      });

      it('should reject password without number', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('número'))).toBe(true);
        }
      });

      it('should reject invalid roleId UUID', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123',
          roleId: 'invalid-uuid'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('UUID válido'))).toBe(true);
        }
      });
    });

    describe('createUserSchema - Length Validation', () => {
      it('should reject username too long', () => {
        const result = createUserSchema.safeParse({
          username: 'a'.repeat(51),
          email: 'test@example.com',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('50 caracteres'))).toBe(true);
        }
      });

      it('should reject email too long', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'a'.repeat(100) + '@example.com',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('100 caracteres'))).toBe(true);
        }
      });

      it('should reject password too long', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'A1' + 'a'.repeat(254),
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('255 caracteres'))).toBe(true);
        }
      });
    });

    describe('createUserSchema - Valid Data', () => {
      it('should accept valid user data', () => {
        const result = createUserSchema.safeParse({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123',
          roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Author Validation Tests', () => {
    describe('createAuthorSchema - Required Fields', () => {
      it('should reject missing firstName', () => {
        const result = createAuthorSchema.safeParse({
          lastName: 'García'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('nombre es requerido'))).toBe(true);
        }
      });

      it('should reject missing lastName', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('apellidos son requeridos'))).toBe(true);
        }
      });

      it('should reject empty firstName', () => {
        const result = createAuthorSchema.safeParse({
          firstName: '',
          lastName: 'García'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('nombre es requerido'))).toBe(true);
        }
      });

      it('should reject empty lastName', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: ''
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('apellidos son requeridos'))).toBe(true);
        }
      });
    });

    describe('createAuthorSchema - Format Validation', () => {
      it('should reject invalid firstName characters', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel123',
          lastName: 'García'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('letras y espacios'))).toBe(true);
        }
      });

      it('should reject invalid lastName characters', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García123'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('letras y espacios'))).toBe(true);
        }
      });

      it('should reject invalid birthDate format', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García',
          birthDate: 'invalid-date'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('YYYY-MM-DD'))).toBe(true);
        }
      });

      it('should reject future birthDate', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García',
          birthDate: '2025-12-31'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('no puede ser futura'))).toBe(true);
        }
      });
    });

    describe('createAuthorSchema - Length Validation', () => {
      it('should reject firstName too long', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'a'.repeat(51),
          lastName: 'García'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('50 caracteres'))).toBe(true);
        }
      });

      it('should reject lastName too long', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'a'.repeat(51)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('50 caracteres'))).toBe(true);
        }
      });

      it('should reject nationality too long', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García',
          nationality: 'a'.repeat(51)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('50 caracteres'))).toBe(true);
        }
      });

      it('should reject biography too long', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García',
          biography: 'a'.repeat(1001)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('1000 caracteres'))).toBe(true);
        }
      });
    });

    describe('createAuthorSchema - Valid Data', () => {
      it('should accept valid minimal author data', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García'
        });
        expect(result.success).toBe(true);
      });

      it('should accept valid complete author data', () => {
        const result = createAuthorSchema.safeParse({
          firstName: 'Gabriel',
          lastName: 'García Márquez',
          nationality: 'Colombiana',
          birthDate: '1927-03-06',
          biography: 'Escritor colombiano, Premio Nobel de Literatura.'
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Genre Validation Tests', () => {
    describe('createGenreSchema - Required Fields', () => {
      it('should reject missing name', () => {
        const result = createGenreSchema.safeParse({
          description: 'Test genre'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('nombre del género es requerido'))).toBe(true);
        }
      });

      it('should reject empty name', () => {
        const result = createGenreSchema.safeParse({
          name: '',
          description: 'Test genre'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('nombre del género es requerido'))).toBe(true);
        }
      });
    });

    describe('createGenreSchema - Format Validation', () => {
      it('should reject invalid name characters', () => {
        const result = createGenreSchema.safeParse({
          name: 'Test@Genre#'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('caracteres no válidos'))).toBe(true);
        }
      });
    });

    describe('createGenreSchema - Length Validation', () => {
      it('should reject name too long', () => {
        const result = createGenreSchema.safeParse({
          name: 'a'.repeat(51)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('50 caracteres'))).toBe(true);
        }
      });
    });

    describe('createGenreSchema - Valid Data', () => {
      it('should accept valid minimal genre data', () => {
        const result = createGenreSchema.safeParse({
          name: 'Test Genre'
        });
        expect(result.success).toBe(true);
      });

      it('should accept valid complete genre data', () => {
        const result = createGenreSchema.safeParse({
          name: 'Science Fiction',
          description: 'Books about futuristic concepts and technology'
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Publishing House Validation Tests', () => {
    describe('createPublishingHouseSchema - Required Fields', () => {
      it('should reject missing name', () => {
        const result = createPublishingHouseSchema.safeParse({
          country: 'Spain'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('nombre de la editorial es requerido'))).toBe(true);
        }
      });

      it('should reject empty name', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: '',
          country: 'Spain'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('nombre de la editorial es requerido'))).toBe(true);
        }
      });
    });

    describe('createPublishingHouseSchema - Format Validation', () => {
      it('should reject invalid name characters', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'Test@Publisher#'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('caracteres no válidos'))).toBe(true);
        }
      });

      it('should reject invalid website URL', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'Test Publisher',
          websiteUrl: 'not-a-url'
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('URL no es válido'))).toBe(true);
        }
      });
    });

    describe('createPublishingHouseSchema - Length Validation', () => {
      it('should reject name too long', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'a'.repeat(101)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('100 caracteres'))).toBe(true);
        }
      });

      it('should reject country too long', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'Test Publisher',
          country: 'a'.repeat(51)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('50 caracteres'))).toBe(true);
        }
      });

      it('should reject website URL too long', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'Test Publisher',
          websiteUrl: 'https://example.com/' + 'a'.repeat(500)
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.errors.some(e => e.message.includes('500 caracteres'))).toBe(true);
        }
      });
    });

    describe('createPublishingHouseSchema - Valid Data', () => {
      it('should accept valid minimal publisher data', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'Test Publisher'
        });
        expect(result.success).toBe(true);
      });

      it('should accept valid complete publisher data', () => {
        const result = createPublishingHouseSchema.safeParse({
          name: 'Planeta Editorial',
          country: 'España',
          websiteUrl: 'https://www.planeta.es'
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Test Data Generator Integration', () => {
    it('should generate valid book data that passes validation', () => {
      const validBookData = generateValidBookData();
      const result = createBookSchema.safeParse(validBookData);
      expect(result.success).toBe(true);
    });

    it('should generate valid user data that passes validation', () => {
      const validUserData = generateValidUserData();
      const result = createUserSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    it('should generate valid author data that passes validation', () => {
      const validAuthorData = generateValidAuthorData();
      const result = createAuthorSchema.safeParse(validAuthorData);
      expect(result.success).toBe(true);
    });

    it('should generate valid genre data that passes validation', () => {
      const validGenreData = generateValidGenreData();
      const result = createGenreSchema.safeParse(validGenreData);
      expect(result.success).toBe(true);
    });

    it('should generate valid publishing house data that passes validation', () => {
      const validPublishingHouseData = generateValidPublishingHouseData();
      const result = createPublishingHouseSchema.safeParse(validPublishingHouseData);
      expect(result.success).toBe(true);
    });
  });

  describe('Invalid Data Generator Integration', () => {
    it('should generate invalid book data that fails validation correctly', () => {
      const scenarios = ['missing_title', 'invalid_isbn', 'negative_price', 'invalid_genre_id', 'invalid_publisher_id'] as const;
      
      scenarios.forEach(scenario => {
        const invalidBookData = generateInvalidBookData(scenario);
        const result = createBookSchema.safeParse(invalidBookData);
        expect(result.success).toBe(false);
      });
    });

    it('should generate invalid user data that fails validation correctly', () => {
      const scenarios = ['missing_username', 'invalid_email', 'weak_password', 'invalid_role_id'] as const;
      
      scenarios.forEach(scenario => {
        const invalidUserData = generateInvalidUserData(scenario);
        const result = createUserSchema.safeParse(invalidUserData);
        expect(result.success).toBe(false);
      });
    });
  });
});

describe('Comprehensive Test Suite Integration', () => {
  it('should run comprehensive validation tests', async () => {
    const validationSuites = await generateComprehensiveValidationTests();
    
    expect(validationSuites).toBeDefined();
    expect(validationSuites.length).toBe(5); // books, users, authors, genres, publishingHouses
    
    validationSuites.forEach(suite => {
      expect(suite.entity).toBeDefined();
      expect(suite.totalTests).toBeGreaterThan(0);
      expect(suite.results).toBeDefined();
      expect(suite.results.length).toBe(suite.totalTests);
      expect(suite.passedTests + suite.failedTests).toBe(suite.totalTests);
    });
  }, 30000); // 30 second timeout for comprehensive tests
});