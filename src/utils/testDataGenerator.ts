import { 
  createBookSchema, 
  updateBookSchema,
  bookSearchSchema,
  bookFilterSchema,
  CreateBookFormData,
  UpdateBookFormData,
  BookSearchFormData,
  BookFilterFormData
} from "@/services/validation/schemas/books";
import { 
  createUserSchema,
  updateUserSchema,
  userSearchSchema,
  changePasswordSchema,
  CreateUserFormData,
  UpdateUserFormData,
  UserSearchFormData,
  ChangePasswordFormData
} from "@/services/validation/schemas/users";
import {
  createAuthorSchema,
  updateAuthorSchema,
  authorSearchSchema,
  bookAuthorAssignmentSchema,
  CreateAuthorFormData,
  UpdateAuthorFormData,
  AuthorSearchFormData,
  BookAuthorAssignmentFormData
} from "@/services/validation/schemas/authors";
import {
  createGenreSchema,
  updateGenreSchema,
  genreSearchSchema,
  CreateGenreFormData,
  UpdateGenreFormData,
  GenreSearchFormData
} from "@/services/validation/schemas/genres";
import {
  createPublishingHouseSchema,
  updatePublishingHouseSchema,
  publishingHouseSearchSchema,
  CreatePublishingHouseFormData,
  UpdatePublishingHouseFormData,
  PublishingHouseSearchFormData
} from "@/services/validation/schemas/publishing-houses";
import { ZodError } from 'zod';

// Generador de datos válidos para libros
export function generateValidBookData(): CreateBookFormData {
  const bookData = {
    title: "El Libro de Prueba Automatizada",
    isbnCode: "9781234567890",
    price: 29.99,
    stockQuantity: 150,
    pageCount: 320,
    publicationDate: "2024-01-15",
    coverImageUrl: "https://ejemplo.com/portada-prueba.jpg",
    summary: "Este es un libro generado automáticamente para pruebas del sistema de formularios dinámicos.",
    genreId: "c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab", // Realismo Mágico
    publisherId: "d875c518-4db9-4dba-86f7-357b3b140fef" // Planeta
  };

  // Validar que los datos generados son válidos según el schema
  const validatedData = createBookSchema.parse(bookData);
  console.log("✅ Datos de libro válidos generados:", validatedData);
  
  return validatedData;
}

// Generador de datos válidos para usuarios
export function generateValidUserData(): CreateUserFormData {
  const timestamp = Date.now();
  const userData = {
    username: `usuario_test_${timestamp}`,
    email: `test_${timestamp}@ejemplo.com`,
    password: "Password123", // Cumple con minúscula, mayúscula y número
    roleId: "d93fcb38-2b78-4cc3-89b8-a8176c8c7e27" // Usuario regular
  };

  // Validar que los datos generados son válidos según el schema
  const validatedData = createUserSchema.parse(userData);
  console.log("✅ Datos de usuario válidos generados:", validatedData);
  
  return validatedData;
}

// Generador de datos válidos para autores
export function generateValidAuthorData(): CreateAuthorFormData {
  const authorData = {
    firstName: "Gabriel",
    lastName: "García Márquez",
    nationality: "Colombiana",
    birthDate: "1927-03-06",
    biography: "Escritor, novelista, cuentista, guionista, editor y periodista colombiano. Reconocido principalmente por sus novelas y cuentos, fue galardonado con el Premio Nobel de Literatura en 1982."
  };

  const validatedData = createAuthorSchema.parse(authorData);
  console.log("✅ Datos de autor válidos generados:", validatedData);
  
  return validatedData;
}

// Generador de datos válidos para géneros
export function generateValidGenreData(): CreateGenreFormData {
  const timestamp = Date.now();
  const genreData = {
    name: `Género Test ${timestamp}`,
    description: "Este es un género generado automáticamente para pruebas del sistema."
  };

  const validatedData = createGenreSchema.parse(genreData);
  console.log("✅ Datos de género válidos generados:", validatedData);
  
  return validatedData;
}

// Generador de datos válidos para editoriales
export function generateValidPublishingHouseData(): CreatePublishingHouseFormData {
  const timestamp = Date.now();
  const publisherData = {
    name: `Editorial Test ${timestamp}`,
    country: "España",
    websiteUrl: "https://ejemplo-editorial.com"
  };

  const validatedData = createPublishingHouseSchema.parse(publisherData);
  console.log("✅ Datos de editorial válidos generados:", validatedData);
  
  return validatedData;
}

// Función para probar la creación directa con API
// Función para probar los campos obligatorios de todos los endpoints
export async function testAllEndpointsRequiredFields() {
  console.log("🧪 Probando campos obligatorios de todos los endpoints...");
  
  const results: any = {
    books: { success: false, requiredFields: [], error: null },
    users: { success: false, requiredFields: [], error: null },
    authors: { success: false, requiredFields: [], error: null },
    genres: { success: false, requiredFields: [], error: null },
    publishingHouses: { success: false, requiredFields: [], error: null }
  };

  try {
    // Importar APIs dinámicamente
    const [
      { bookCatalogApi },
      { usersApi },
      { authorsApi },
      { genresApi },
      { publishingHousesApi }
    ] = await Promise.all([
      import("@/services/api/entities/book-catalog"),
      import("@/services/api/entities/users"),
      import("@/services/api/entities/authors"),
      import("@/services/api/entities/genres"),
      import("@/services/api/entities/publishing-houses")
    ]);

    // Test 1: Libros con datos completos
    console.log("📚 Probando creación de libro...");
    try {
      const bookData = generateValidBookData();
      const bookResult = await bookCatalogApi.create(bookData);
      results.books.success = true;
      results.books.requiredFields = Object.keys(bookData);
      console.log("✅ Libro creado exitosamente:", bookResult);
    } catch (error: any) {
      results.books.error = error.message || error;
      console.error("❌ Error creando libro:", error);
    }

    // Test 2: Usuarios con datos completos
    console.log("👤 Probando creación de usuario...");
    try {
      const userData = generateValidUserData();
      const userResult = await usersApi.create(userData);
      results.users.success = true;
      results.users.requiredFields = Object.keys(userData);
      console.log("✅ Usuario creado exitosamente:", userResult);
    } catch (error: any) {
      results.users.error = error.message || error;
      console.error("❌ Error creando usuario:", error);
    }

    // Test 3: Autores con datos completos
    console.log("✍️ Probando creación de autor...");
    try {
      const authorData = generateValidAuthorData();
      const authorResult = await authorsApi.create(authorData);
      results.authors.success = true;
      results.authors.requiredFields = Object.keys(authorData);
      console.log("✅ Autor creado exitosamente:", authorResult);
    } catch (error: any) {
      results.authors.error = error.message || error;
      console.error("❌ Error creando autor:", error);
    }

    // Test 4: Géneros con datos completos
    console.log("📖 Probando creación de género...");
    try {
      const genreData = generateValidGenreData();
      const genreResult = await genresApi.create(genreData);
      results.genres.success = true;
      results.genres.requiredFields = Object.keys(genreData);
      console.log("✅ Género creado exitosamente:", genreResult);
    } catch (error: any) {
      results.genres.error = error.message || error;
      console.error("❌ Error creando género:", error);
    }

    // Test 5: Editoriales con datos completos
    console.log("🏢 Probando creación de editorial...");
    try {
      const publisherData = generateValidPublishingHouseData();
      const publisherResult = await publishingHousesApi.create(publisherData);
      results.publishingHouses.success = true;
      results.publishingHouses.requiredFields = Object.keys(publisherData);
      console.log("✅ Editorial creada exitosamente:", publisherResult);
    } catch (error: any) {
      results.publishingHouses.error = error.message || error;
      console.error("❌ Error creando editorial:", error);
    }

    return {
      results,
      summary: {
        total: 5,
        successful: Object.values(results).filter((r: any) => r.success).length,
        failed: Object.values(results).filter((r: any) => !r.success).length
      }
    };
    
  } catch (error) {
    console.error("❌ Error general en pruebas:", error);
    return {
      results,
      error: error,
      summary: { total: 5, successful: 0, failed: 5 }
    };
  }
}

// Función para probar campos obligatorios con datos vacíos o inválidos
export async function testRequiredFieldsValidation() {
  console.log("🧪 Probando validación de campos obligatorios...");
  
  const validationResults: any = {
    books: { requiredFields: [], optionalFields: [] },
    users: { requiredFields: [], optionalFields: [] },
    authors: { requiredFields: [], optionalFields: [] },
    genres: { requiredFields: [], optionalFields: [] },
    publishingHouses: { requiredFields: [], optionalFields: [] }
  };

  // Test Books - Probar con objeto vacío
  try {
    createBookSchema.parse({});
  } catch (error: any) {
    console.log("🔍 Error de validación para books:", error);
    if (error.errors) {
      validationResults.books.requiredFields = [...new Set(error.errors.map((e: any) => e.path[0]).filter(Boolean))];
    }
  }

  // Test Users - Probar con objeto vacío
  try {
    createUserSchema.parse({});
  } catch (error: any) {
    console.log("🔍 Error de validación para users:", error);
    if (error.errors) {
      validationResults.users.requiredFields = [...new Set(error.errors.map((e: any) => e.path[0]).filter(Boolean))];
    }
  }

  // Test Authors - Probar con objeto vacío
  try {
    createAuthorSchema.parse({});
  } catch (error: any) {
    console.log("🔍 Error de validación para authors:", error);
    if (error.errors) {
      validationResults.authors.requiredFields = [...new Set(error.errors.map((e: any) => e.path[0]).filter(Boolean))];
    }
  }

  // Test Genres - Probar con objeto vacío
  try {
    createGenreSchema.parse({});
  } catch (error: any) {
    console.log("🔍 Error de validación para genres:", error);
    if (error.errors) {
      validationResults.genres.requiredFields = [...new Set(error.errors.map((e: any) => e.path[0]).filter(Boolean))];
    }
  }

  // Test Publishing Houses - Probar con objeto vacío
  try {
    createPublishingHouseSchema.parse({});
  } catch (error: any) {
    console.log("🔍 Error de validación para publishingHouses:", error);
    if (error.errors) {
      validationResults.publishingHouses.requiredFields = [...new Set(error.errors.map((e: any) => e.path[0]).filter(Boolean))];
    }
  }

  console.log("✅ Análisis de campos obligatorios completado:", validationResults);
  return validationResults;
}

// ============================================================================
// COMPREHENSIVE VALIDATION TEST SCENARIOS
// ============================================================================

export interface ValidationTestResult {
  scenario: string;
  entity: string;
  success: boolean;
  expectedError?: string;
  actualError?: string;
  data?: any;
}

export interface ValidationTestSuite {
  entity: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: ValidationTestResult[];
}

// Generate comprehensive test scenarios for all entities
export async function generateComprehensiveValidationTests(): Promise<ValidationTestSuite[]> {
  const testSuites: ValidationTestSuite[] = [];

  // Test Books
  const bookTests = await generateBookValidationTests();
  testSuites.push(bookTests);

  // Test Users
  const userTests = await generateUserValidationTests();
  testSuites.push(userTests);

  // Test Authors
  const authorTests = await generateAuthorValidationTests();
  testSuites.push(authorTests);

  // Test Genres
  const genreTests = await generateGenreValidationTests();
  testSuites.push(genreTests);

  // Test Publishing Houses
  const publishingHouseTests = await generatePublishingHouseValidationTests();
  testSuites.push(publishingHouseTests);

  return testSuites;
}

// ============================================================================
// BOOK VALIDATION TESTS
// ============================================================================

export async function generateBookValidationTests(): Promise<ValidationTestSuite> {
  const results: ValidationTestResult[] = [];

  // Required field tests
  const requiredFieldTests = [
    { scenario: 'Missing title', data: { isbnCode: '1234567890', price: 10, genreId: 'uuid', publisherId: 'uuid' }, expectedError: 'El título es requerido' },
    { scenario: 'Empty title', data: { title: '', isbnCode: '1234567890', price: 10, genreId: 'uuid', publisherId: 'uuid' }, expectedError: 'El título es requerido' },
    { scenario: 'Missing ISBN', data: { title: 'Test Book', price: 10, genreId: 'uuid', publisherId: 'uuid' }, expectedError: 'El código ISBN es requerido' },
    { scenario: 'Missing price', data: { title: 'Test Book', isbnCode: '1234567890', genreId: 'uuid', publisherId: 'uuid' }, expectedError: 'Required' },
    { scenario: 'Missing genreId', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, publisherId: 'uuid' }, expectedError: 'Debe seleccionar un género' },
    { scenario: 'Missing publisherId', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, genreId: 'uuid' }, expectedError: 'Debe seleccionar una editorial' }
  ];

  // Field length validation tests
  const lengthTests = [
    { scenario: 'Title too long', data: { title: 'A'.repeat(256), isbnCode: '1234567890', price: 10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El título no puede exceder 255 caracteres' },
    { scenario: 'ISBN too long', data: { title: 'Test Book', isbnCode: '12345678901234', price: 10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El código ISBN no puede exceder 13 caracteres' },
    { scenario: 'Cover URL too long', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, coverImageUrl: 'https://example.com/' + 'a'.repeat(500), genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'La URL de portada no puede exceder 500 caracteres' }
  ];

  // Format validation tests
  const formatTests = [
    { scenario: 'Invalid ISBN format', data: { title: 'Test Book', isbnCode: 'invalid-isbn', price: 10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El ISBN debe contener solo números, guiones y X' },
    { scenario: 'Negative price', data: { title: 'Test Book', isbnCode: '1234567890', price: -10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El precio no puede ser negativo' },
    { scenario: 'Price too high', data: { title: 'Test Book', isbnCode: '1234567890', price: 100000000, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El precio es demasiado alto' },
    { scenario: 'Invalid genreId UUID', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, genreId: 'invalid-uuid', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El ID del género debe ser un UUID válido' },
    { scenario: 'Invalid publisherId UUID', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'invalid-uuid' }, expectedError: 'El ID de la editorial debe ser un UUID válido' },
    { scenario: 'Invalid cover URL format', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, coverImageUrl: 'not-a-url', genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El formato de la URL de portada no es válido' },
    { scenario: 'Invalid publication date', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, publicationDate: 'invalid-date', genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'La fecha de publicación no es válida' },
    { scenario: 'Negative stock quantity', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, stockQuantity: -1, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El stock no puede ser negativo' },
    { scenario: 'Invalid page count (zero)', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, pageCount: 0, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El número de páginas debe ser mayor a 0' },
    { scenario: 'Invalid page count (negative)', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, pageCount: -10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: 'El número de páginas debe ser mayor a 0' }
  ];

  // Valid data tests
  const validTests = [
    { scenario: 'Valid minimal book data', data: { title: 'Test Book', isbnCode: '1234567890', price: 10, genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: null },
    { scenario: 'Valid complete book data', data: { title: 'Complete Test Book', isbnCode: '1234567890123', price: 29.99, stockQuantity: 100, coverImageUrl: 'https://example.com/cover.jpg', publicationDate: '2024-01-01', pageCount: 300, summary: 'A comprehensive test book', genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab', publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef' }, expectedError: null }
  ];

  const allTests = [...requiredFieldTests, ...lengthTests, ...formatTests, ...validTests];

  for (const test of allTests) {
    try {
      createBookSchema.parse(test.data);
      results.push({
        scenario: test.scenario,
        entity: 'books',
        success: test.expectedError === null,
        data: test.data
      });
    } catch (error) {
      const zodError = error as ZodError;
      const actualError = zodError.errors[0]?.message || 'Unknown error';
      results.push({
        scenario: test.scenario,
        entity: 'books',
        success: test.expectedError !== null && actualError.includes(test.expectedError),
        expectedError: test.expectedError || undefined,
        actualError,
        data: test.data
      });
    }
  }

  return {
    entity: 'books',
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  };
}

// ============================================================================
// USER VALIDATION TESTS
// ============================================================================

export async function generateUserValidationTests(): Promise<ValidationTestSuite> {
  const results: ValidationTestResult[] = [];

  // Required field tests
  const requiredFieldTests = [
    { scenario: 'Missing username', data: { email: 'test@example.com', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'El nombre de usuario es requerido' },
    { scenario: 'Missing email', data: { username: 'testuser', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'El email es requerido' },
    { scenario: 'Missing password', data: { username: 'testuser', email: 'test@example.com', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'Required' },
    { scenario: 'Missing roleId', data: { username: 'testuser', email: 'test@example.com', password: 'Password123' }, expectedError: 'Required' }
  ];

  // Format validation tests
  const formatTests = [
    { scenario: 'Invalid username characters', data: { username: 'test user!', email: 'test@example.com', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos' },
    { scenario: 'Invalid email format', data: { username: 'testuser', email: 'invalid-email', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'El formato del email no es válido' },
    { scenario: 'Short password', data: { username: 'testuser', email: 'test@example.com', password: 'short', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'La contraseña debe tener al menos 8 caracteres' },
    { scenario: 'Password without uppercase', data: { username: 'testuser', email: 'test@example.com', password: 'password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'La contraseña debe contener al menos una minúscula, una mayúscula y un número' },
    { scenario: 'Password without lowercase', data: { username: 'testuser', email: 'test@example.com', password: 'PASSWORD123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'La contraseña debe contener al menos una minúscula, una mayúscula y un número' },
    { scenario: 'Password without number', data: { username: 'testuser', email: 'test@example.com', password: 'Password', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'La contraseña debe contener al menos una minúscula, una mayúscula y un número' },
    { scenario: 'Invalid roleId UUID', data: { username: 'testuser', email: 'test@example.com', password: 'Password123', roleId: 'invalid-uuid' }, expectedError: 'El ID del rol debe ser un UUID válido' }
  ];

  // Length validation tests
  const lengthTests = [
    { scenario: 'Username too long', data: { username: 'a'.repeat(51), email: 'test@example.com', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'El nombre de usuario no puede exceder 50 caracteres' },
    { scenario: 'Email too long', data: { username: 'testuser', email: 'a'.repeat(100) + '@example.com', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'El email no puede exceder 100 caracteres' },
    { scenario: 'Password too long', data: { username: 'testuser', email: 'test@example.com', password: 'A1' + 'a'.repeat(254), roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: 'La contraseña no puede exceder 255 caracteres' }
  ];

  // Valid data tests
  const validTests = [
    { scenario: 'Valid user data', data: { username: 'testuser', email: 'test@example.com', password: 'Password123', roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27' }, expectedError: null }
  ];

  const allTests = [...requiredFieldTests, ...formatTests, ...lengthTests, ...validTests];

  for (const test of allTests) {
    try {
      createUserSchema.parse(test.data);
      results.push({
        scenario: test.scenario,
        entity: 'users',
        success: test.expectedError === null,
        data: test.data
      });
    } catch (error) {
      const zodError = error as ZodError;
      const actualError = zodError.errors[0]?.message || 'Unknown error';
      results.push({
        scenario: test.scenario,
        entity: 'users',
        success: test.expectedError !== null && actualError.includes(test.expectedError),
        expectedError: test.expectedError || undefined,
        actualError,
        data: test.data
      });
    }
  }

  return {
    entity: 'users',
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  };
}

// ============================================================================
// AUTHOR VALIDATION TESTS
// ============================================================================

export async function generateAuthorValidationTests(): Promise<ValidationTestSuite> {
  const results: ValidationTestResult[] = [];

  // Required field tests
  const requiredFieldTests = [
    { scenario: 'Missing firstName', data: { lastName: 'García' }, expectedError: 'El nombre es requerido' },
    { scenario: 'Missing lastName', data: { firstName: 'Gabriel' }, expectedError: 'Los apellidos son requeridos' },
    { scenario: 'Empty firstName', data: { firstName: '', lastName: 'García' }, expectedError: 'El nombre es requerido' },
    { scenario: 'Empty lastName', data: { firstName: 'Gabriel', lastName: '' }, expectedError: 'Los apellidos son requeridos' }
  ];

  // Format validation tests
  const formatTests = [
    { scenario: 'Invalid firstName characters', data: { firstName: 'Gabriel123', lastName: 'García' }, expectedError: 'El nombre solo puede contener letras y espacios' },
    { scenario: 'Invalid lastName characters', data: { firstName: 'Gabriel', lastName: 'García123' }, expectedError: 'Los apellidos solo pueden contener letras y espacios' },
    { scenario: 'Invalid birthDate format', data: { firstName: 'Gabriel', lastName: 'García', birthDate: 'invalid-date' }, expectedError: 'La fecha debe tener formato YYYY-MM-DD' },
    { scenario: 'Future birthDate', data: { firstName: 'Gabriel', lastName: 'García', birthDate: '2025-12-31' }, expectedError: 'La fecha de nacimiento no puede ser futura' }
  ];

  // Length validation tests
  const lengthTests = [
    { scenario: 'FirstName too long', data: { firstName: 'a'.repeat(51), lastName: 'García' }, expectedError: 'El nombre no puede exceder 50 caracteres' },
    { scenario: 'LastName too long', data: { firstName: 'Gabriel', lastName: 'a'.repeat(51) }, expectedError: 'Los apellidos no pueden exceder 50 caracteres' },
    { scenario: 'Nationality too long', data: { firstName: 'Gabriel', lastName: 'García', nationality: 'a'.repeat(51) }, expectedError: 'La nacionalidad no puede exceder 50 caracteres' },
    { scenario: 'Biography too long', data: { firstName: 'Gabriel', lastName: 'García', biography: 'a'.repeat(1001) }, expectedError: 'La biografía no puede exceder 1000 caracteres' }
  ];

  // Valid data tests
  const validTests = [
    { scenario: 'Valid minimal author data', data: { firstName: 'Gabriel', lastName: 'García' }, expectedError: null },
    { scenario: 'Valid complete author data', data: { firstName: 'Gabriel', lastName: 'García Márquez', nationality: 'Colombiana', birthDate: '1927-03-06', biography: 'Escritor colombiano, Premio Nobel de Literatura.' }, expectedError: null }
  ];

  const allTests = [...requiredFieldTests, ...formatTests, ...lengthTests, ...validTests];

  for (const test of allTests) {
    try {
      createAuthorSchema.parse(test.data);
      results.push({
        scenario: test.scenario,
        entity: 'authors',
        success: test.expectedError === null,
        data: test.data
      });
    } catch (error) {
      const zodError = error as ZodError;
      const actualError = zodError.errors[0]?.message || 'Unknown error';
      results.push({
        scenario: test.scenario,
        entity: 'authors',
        success: test.expectedError !== null && actualError.includes(test.expectedError),
        expectedError: test.expectedError || undefined,
        actualError,
        data: test.data
      });
    }
  }

  return {
    entity: 'authors',
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  };
}

// ============================================================================
// GENRE VALIDATION TESTS
// ============================================================================

export async function generateGenreValidationTests(): Promise<ValidationTestSuite> {
  const results: ValidationTestResult[] = [];

  // Required field tests
  const requiredFieldTests = [
    { scenario: 'Missing name', data: { description: 'Test genre' }, expectedError: 'El nombre del género es requerido' },
    { scenario: 'Empty name', data: { name: '', description: 'Test genre' }, expectedError: 'El nombre del género es requerido' }
  ];

  // Format validation tests
  const formatTests = [
    { scenario: 'Invalid name characters', data: { name: 'Test@Genre#' }, expectedError: 'El nombre contiene caracteres no válidos' }
  ];

  // Length validation tests
  const lengthTests = [
    { scenario: 'Name too long', data: { name: 'a'.repeat(51) }, expectedError: 'El nombre no puede exceder 50 caracteres' }
  ];

  // Valid data tests
  const validTests = [
    { scenario: 'Valid minimal genre data', data: { name: 'Test Genre' }, expectedError: null },
    { scenario: 'Valid complete genre data', data: { name: 'Science Fiction', description: 'Books about futuristic concepts and technology' }, expectedError: null }
  ];

  const allTests = [...requiredFieldTests, ...formatTests, ...lengthTests, ...validTests];

  for (const test of allTests) {
    try {
      createGenreSchema.parse(test.data);
      results.push({
        scenario: test.scenario,
        entity: 'genres',
        success: test.expectedError === null,
        data: test.data
      });
    } catch (error) {
      const zodError = error as ZodError;
      const actualError = zodError.errors[0]?.message || 'Unknown error';
      results.push({
        scenario: test.scenario,
        entity: 'genres',
        success: test.expectedError !== null && actualError.includes(test.expectedError),
        expectedError: test.expectedError || undefined,
        actualError,
        data: test.data
      });
    }
  }

  return {
    entity: 'genres',
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  };
}

// ============================================================================
// PUBLISHING HOUSE VALIDATION TESTS
// ============================================================================

export async function generatePublishingHouseValidationTests(): Promise<ValidationTestSuite> {
  const results: ValidationTestResult[] = [];

  // Required field tests
  const requiredFieldTests = [
    { scenario: 'Missing name', data: { country: 'Spain' }, expectedError: 'El nombre de la editorial es requerido' },
    { scenario: 'Empty name', data: { name: '', country: 'Spain' }, expectedError: 'El nombre de la editorial es requerido' }
  ];

  // Format validation tests
  const formatTests = [
    { scenario: 'Invalid name characters', data: { name: 'Test@Publisher#' }, expectedError: 'El nombre contiene caracteres no válidos' },
    { scenario: 'Invalid website URL', data: { name: 'Test Publisher', websiteUrl: 'not-a-url' }, expectedError: 'El formato de la URL no es válido' }
  ];

  // Length validation tests
  const lengthTests = [
    { scenario: 'Name too long', data: { name: 'a'.repeat(101) }, expectedError: 'El nombre no puede exceder 100 caracteres' },
    { scenario: 'Country too long', data: { name: 'Test Publisher', country: 'a'.repeat(51) }, expectedError: 'El país no puede exceder 50 caracteres' },
    { scenario: 'Website URL too long', data: { name: 'Test Publisher', websiteUrl: 'https://example.com/' + 'a'.repeat(500) }, expectedError: 'La URL del sitio web no puede exceder 500 caracteres' }
  ];

  // Valid data tests
  const validTests = [
    { scenario: 'Valid minimal publisher data', data: { name: 'Test Publisher' }, expectedError: null },
    { scenario: 'Valid complete publisher data', data: { name: 'Planeta Editorial', country: 'España', websiteUrl: 'https://www.planeta.es' }, expectedError: null }
  ];

  const allTests = [...requiredFieldTests, ...formatTests, ...lengthTests, ...validTests];

  for (const test of allTests) {
    try {
      createPublishingHouseSchema.parse(test.data);
      results.push({
        scenario: test.scenario,
        entity: 'publishingHouses',
        success: test.expectedError === null,
        data: test.data
      });
    } catch (error) {
      const zodError = error as ZodError;
      const actualError = zodError.errors[0]?.message || 'Unknown error';
      results.push({
        scenario: test.scenario,
        entity: 'publishingHouses',
        success: test.expectedError !== null && actualError.includes(test.expectedError),
        expectedError: test.expectedError || undefined,
        actualError,
        data: test.data
      });
    }
  }

  return {
    entity: 'publishingHouses',
    totalTests: results.length,
    passedTests: results.filter(r => r.success).length,
    failedTests: results.filter(r => !r.success).length,
    results
  };
}

// ============================================================================
// API ENDPOINT TESTING
// ============================================================================

export interface EndpointTestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode?: number;
  response?: any;
  error?: any;
  duration: number;
}

export async function testAllEndpoints(): Promise<{ results: EndpointTestResult[], summary: { total: number, successful: number, failed: number } }> {
  console.log('🧪 Testing all API endpoints...');
  const results: EndpointTestResult[] = [];
  
  try {
    // Import APIs dynamically
    const [
      { bookCatalogApi },
      { usersApi },
      { authorsApi },
      { genresApi },
      { publishingHousesApi },
      { rolesApi }
    ] = await Promise.all([
      import("@/services/api/entities/book-catalog"),
      import("@/services/api/entities/users"),
      import("@/services/api/entities/authors"),
      import("@/services/api/entities/genres"),
      import("@/services/api/entities/publishing-houses"),
      import("@/services/api/entities/roles")
    ]);

    // Test Books endpoints
    await testEndpoint(results, 'GET /book-catalog', 'GET', () => bookCatalogApi.list({ page: 1, limit: 5 }));
    await testEndpoint(results, 'POST /book-catalog', 'POST', () => bookCatalogApi.create(generateValidBookData()));
    await testEndpoint(results, 'GET /book-catalog/search', 'GET', () => bookCatalogApi.search({ term: 'test', page: 1, limit: 5 }));
    await testEndpoint(results, 'GET /book-catalog/available', 'GET', () => bookCatalogApi.available(1, 5));

    // Test Users endpoints
    await testEndpoint(results, 'GET /users', 'GET', () => usersApi.list({ page: 1, limit: 5 }));
    await testEndpoint(results, 'POST /users', 'POST', () => usersApi.create(generateValidUserData()));

    // Test Authors endpoints
    await testEndpoint(results, 'GET /book-authors', 'GET', () => authorsApi.list({ page: 1, limit: 5 }));
    await testEndpoint(results, 'POST /book-authors', 'POST', () => authorsApi.create(generateValidAuthorData()));
    await testEndpoint(results, 'GET /book-authors/search', 'GET', () => authorsApi.search({ term: 'García', page: 1, limit: 5 }));

    // Test Genres endpoints
    await testEndpoint(results, 'GET /genres', 'GET', () => genresApi.list({ page: 1, limit: 5 }));
    await testEndpoint(results, 'POST /genres', 'POST', () => genresApi.create(generateValidGenreData()));
    await testEndpoint(results, 'GET /genres/search', 'GET', () => genresApi.search({ q: 'fiction', page: 1, limit: 5 }));

    // Test Publishing Houses endpoints
    await testEndpoint(results, 'GET /publishing-houses', 'GET', () => publishingHousesApi.list({ page: 1, limit: 5 }));
    await testEndpoint(results, 'POST /publishing-houses', 'POST', () => publishingHousesApi.create(generateValidPublishingHouseData()));
    await testEndpoint(results, 'GET /publishing-houses/search', 'GET', () => publishingHousesApi.search({ term: 'Planeta', page: 1, limit: 5 }));

    // Test Roles endpoints
    await testEndpoint(results, 'GET /roles', 'GET', () => rolesApi.list());

  } catch (error) {
    console.error('❌ Error setting up endpoint tests:', error);
  }

  return {
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  };
}

async function testEndpoint(results: EndpointTestResult[], endpoint: string, method: string, testFn: () => Promise<any>) {
  const startTime = Date.now();
  try {
    const response = await testFn();
    const duration = Date.now() - startTime;
    
    results.push({
      endpoint,
      method,
      success: true,
      statusCode: 200,
      response,
      duration
    });
    
    console.log(`✅ ${endpoint} - Success (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    results.push({
      endpoint,
      method,
      success: false,
      statusCode: error.statusCode || 0,
      error: error.message || error,
      duration
    });
    
    console.log(`❌ ${endpoint} - Failed (${duration}ms): ${error.message || error}`);
  }
}

// Function legacy para retrocompatibilidad
export async function testDirectApiCall() {
  return testAllEndpointsRequiredFields();
}

// Generate invalid data for edge case testing
export function generateInvalidBookData(scenario: 'missing_title' | 'invalid_isbn' | 'negative_price' | 'invalid_genre_id' | 'invalid_publisher_id') {
  const base = {
    title: 'Test Book',
    isbnCode: '1234567890',
    price: 10,
    genreId: 'c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab',
    publisherId: 'd875c518-4db9-4dba-86f7-357b3b140fef'
  };

  switch (scenario) {
    case 'missing_title':
      return { ...base, title: undefined };
    case 'invalid_isbn':
      return { ...base, isbnCode: 'invalid-isbn-format' };
    case 'negative_price':
      return { ...base, price: -10 };
    case 'invalid_genre_id':
      return { ...base, genreId: 'invalid-uuid' };
    case 'invalid_publisher_id':
      return { ...base, publisherId: 'invalid-uuid' };
    default:
      return base;
  }
}

export function generateInvalidUserData(scenario: 'missing_username' | 'invalid_email' | 'weak_password' | 'invalid_role_id') {
  const base = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123',
    roleId: 'd93fcb38-2b78-4cc3-89b8-a8176c8c7e27'
  };

  switch (scenario) {
    case 'missing_username':
      return { ...base, username: undefined };
    case 'invalid_email':
      return { ...base, email: 'invalid-email' };
    case 'weak_password':
      return { ...base, password: 'weak' };
    case 'invalid_role_id':
      return { ...base, roleId: 'invalid-uuid' };
    default:
      return base;
  }
}