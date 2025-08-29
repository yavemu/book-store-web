import { loginSchema, registerSchema } from '../auth';

describe('Auth Schemas - Simple Tests', () => {
  describe('loginSchema', () => {
    describe('Valid cases', () => {
      it('should validate correct login data', () => {
        const result = loginSchema.safeParse({
          email: 'test@example.com',
          password: 'password123',
        });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.email).toBe('test@example.com');
          expect(result.data.password).toBe('password123');
        }
      });

      it('should validate different email formats', () => {
        const emails = [
          'user@domain.com',
          'user.name@domain.com', 
          'user+tag@domain.co.uk',
        ];

        emails.forEach(email => {
          const result = loginSchema.safeParse({
            email,
            password: 'password123',
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe('Invalid cases', () => {
      it('should reject invalid email formats', () => {
        const invalidEmails = [
          '',
          'notanemail',
          'user@',
          '@domain.com',
          'user..double@domain.com',
        ];

        invalidEmails.forEach(email => {
          const result = loginSchema.safeParse({
            email,
            password: 'password123',
          });
          expect(result.success).toBe(false);
        });
      });

      it('should reject passwords shorter than 8 characters', () => {
        const shortPasswords = ['', '1', '12', '1234567'];
        
        shortPasswords.forEach(password => {
          const result = loginSchema.safeParse({
            email: 'test@example.com',
            password,
          });
          expect(result.success).toBe(false);
        });
      });

      it('should provide specific error messages', () => {
        const result = loginSchema.safeParse({
          email: '',
          password: '123', // too short
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
          
          const emailErrors = result.error.issues.filter(e => e.path[0] === 'email');
          const passwordErrors = result.error.issues.filter(e => e.path[0] === 'password');
          
          expect(emailErrors.length).toBeGreaterThanOrEqual(1);
          expect(passwordErrors.length).toBeGreaterThanOrEqual(1);
          expect(emailErrors.some(e => e.message === 'El email es requerido')).toBe(true);
          expect(passwordErrors.some(e => e.message === 'La contraseña debe tener al menos 8 caracteres')).toBe(true);
        }
      });
    });
  });

  describe('registerSchema', () => {
    describe('Valid cases', () => {
      it('should validate complete registration data', () => {
        const result = registerSchema.safeParse({
          username: 'testuser123',
          email: 'test@example.com',
          password: 'Password123',
          roleId: '123e4567-e89b-12d3-a456-426614174000',
        });

        expect(result.success).toBe(true);
      });

      it('should validate without roleId', () => {
        const result = registerSchema.safeParse({
          username: 'testuser123',
          email: 'test@example.com',
          password: 'Password123',
        });

        expect(result.success).toBe(true);
      });

      it('should validate different username formats', () => {
        const validUsernames = [
          'user',
          'user123',
          'user_name',
          'user-name',
          'USER',
          'a'.repeat(50), // max length
        ];

        validUsernames.forEach(username => {
          const result = registerSchema.safeParse({
            username,
            email: 'test@example.com',
            password: 'Password123',
          });
          expect(result.success).toBe(true);
        });
      });

      it('should validate strong passwords', () => {
        const validPasswords = [
          'Password123',
          'MyStrongP4ss',
          'aB1cdefghij',
        ];

        validPasswords.forEach(password => {
          const result = registerSchema.safeParse({
            username: 'testuser',
            email: 'test@example.com',
            password,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe('Invalid cases', () => {
      it('should reject invalid usernames', () => {
        const invalidUsernames = [
          '',
          'a'.repeat(51), // too long
          'user@name', // invalid characters
          'user name', // space
          'user.name', // dot
          'user#name', // hash
        ];

        invalidUsernames.forEach(username => {
          const result = registerSchema.safeParse({
            username,
            email: 'test@example.com',
            password: 'Password123',
          });
          expect(result.success).toBe(false);
        });
      });

      it('should reject weak passwords', () => {
        const weakPasswords = [
          'password123', // no uppercase
          'PASSWORD123', // no lowercase  
          'Password', // no number
          '1234567', // too short
          'a'.repeat(101), // too long
        ];

        weakPasswords.forEach(password => {
          const result = registerSchema.safeParse({
            username: 'testuser',
            email: 'test@example.com',
            password,
          });
          expect(result.success).toBe(false);
        });
      });

      it('should reject invalid roleId', () => {
        const invalidRoleIds = [
          'not-a-uuid',
          '123',
          '123e4567-e89b-12d3-a456', // too short
          'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // invalid chars
        ];

        invalidRoleIds.forEach(roleId => {
          const result = registerSchema.safeParse({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123',
            roleId,
          });
          expect(result.success).toBe(false);
        });
      });

      it('should provide comprehensive error messages', () => {
        const result = registerSchema.safeParse({
          username: 'invalid@user',
          email: 'invalid-email',
          password: 'weak',
          roleId: 'not-uuid',
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(3);
          
          const messages = result.error.issues.map(e => e.message);
          expect(messages).toContain('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos');
          expect(messages).toContain('El formato del email no es válido');
          expect(messages).toContain('La contraseña debe tener al menos 8 caracteres');
          expect(messages).toContain('El ID del rol debe ser un UUID válido');
        }
      });
    });

    describe('Edge cases', () => {
      it('should validate minimum length fields', () => {
        const result = registerSchema.safeParse({
          username: 'a',
          email: 'a@b.co',
          password: 'Password1',
        });

        expect(result.success).toBe(true);
      });

      it('should validate maximum length fields', () => {
        const result = registerSchema.safeParse({
          username: 'a'.repeat(50),
          email: 'a'.repeat(90) + '@test.com', // 99 chars total
          password: 'Pass1' + 'a'.repeat(95), // 100 chars total
        });

        expect(result.success).toBe(true);
      });

      it('should reject over-maximum length fields', () => {
        const tests = [
          { username: 'a'.repeat(51), email: 'test@test.com', password: 'Password1' },
          { username: 'user', email: 'a'.repeat(96) + '@test.com', password: 'Password1' }, // 101 chars
          { username: 'user', email: 'test@test.com', password: 'Pass1' + 'a'.repeat(96) }, // 101 chars
        ];

        tests.forEach(testData => {
          const result = registerSchema.safeParse(testData);
          expect(result.success).toBe(false);
        });
      });
    });
  });
});