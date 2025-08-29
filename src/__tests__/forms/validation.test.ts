import { 
  createBookSchema, 
  createUserSchema 
} from '@/services/validation/schemas';
import { 
  generateValidBookData, 
  generateValidUserData 
} from '@/utils/testDataGenerator';

describe('Form Validation Tests', () => {
  describe('Book Schema Validation', () => {
    it('should validate valid book data', () => {
      const validBookData = generateValidBookData();
      const result = createBookSchema.safeParse(validBookData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe(validBookData.title);
        expect(typeof result.data.price).toBe('number');
        expect(typeof result.data.stockQuantity).toBe('number');
        expect(typeof result.data.pageCount).toBe('number');
      }
    });

    it('should reject invalid book data', () => {
      const invalidBookData = {
        title: '', // Título vacío
        price: -10, // Precio negativo
        stockQuantity: 'invalid', // Tipo incorrecto
        genreId: 'not-a-uuid' // UUID inválido
      };
      
      const result = createBookSchema.safeParse(invalidBookData);
      expect(result.success).toBe(false);
    });

    it('should handle decimal prices correctly', () => {
      const bookDataWithDecimal = generateValidBookData();
      bookDataWithDecimal.price = 29.99;
      
      const result = createBookSchema.safeParse(bookDataWithDecimal);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(29.99);
      }
    });

    it('should validate date format', () => {
      const bookDataWithDate = generateValidBookData();
      bookDataWithDate.publicationDate = '2024-01-15';
      
      const result = createBookSchema.safeParse(bookDataWithDate);
      expect(result.success).toBe(true);
    });
  });

  describe('User Schema Validation', () => {
    it('should validate valid user data', () => {
      const validUserData = generateValidUserData();
      const result = createUserSchema.safeParse(validUserData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe(validUserData.username);
        expect(result.data.email).toContain('@');
        expect(result.data.password.length).toBeGreaterThanOrEqual(8);
      }
    });

    it('should reject invalid user data', () => {
      const invalidUserData = {
        username: '', // Username vacío
        email: 'invalid-email', // Email inválido
        password: '123', // Password muy corto
        roleId: 'not-a-uuid' // UUID inválido
      };
      
      const result = createUserSchema.safeParse(invalidUserData);
      expect(result.success).toBe(false);
    });

    it('should validate email format', () => {
      const userData = generateValidUserData();
      userData.email = 'test@ejemplo.com';
      
      const result = createUserSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it('should validate UUID format for roleId', () => {
      const userData = generateValidUserData();
      userData.roleId = 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27';
      
      const result = createUserSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });
  });
});