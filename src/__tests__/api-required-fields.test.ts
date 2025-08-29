import { testRequiredFieldsValidation, testAllEndpointsRequiredFields } from '@/utils/testDataGenerator';

describe('API Required Fields Analysis', () => {
  it('should identify required fields from Zod schemas', async () => {
    const validationResults = await testRequiredFieldsValidation();
    
    console.log('📋 CAMPOS OBLIGATORIOS IDENTIFICADOS:', JSON.stringify(validationResults, null, 2));
    
    // Verificar que se identificaron campos obligatorios para cada entidad
    expect(validationResults.books.requiredFields.length).toBeGreaterThan(0);
    expect(validationResults.users.requiredFields.length).toBeGreaterThan(0);
    expect(validationResults.authors.requiredFields.length).toBeGreaterThan(0);
    expect(validationResults.genres.requiredFields.length).toBeGreaterThan(0);
    expect(validationResults.publishingHouses.requiredFields.length).toBeGreaterThan(0);
  });

  it('should test actual API endpoints', async () => {
    const apiResults = await testAllEndpointsRequiredFields();
    
    console.log('🚀 RESULTADOS DE APIS:', JSON.stringify(apiResults, null, 2));
    
    // Verificar que se obtuvieron resultados
    expect(apiResults.results).toBeDefined();
    expect(apiResults.summary.total).toBe(5);
    
    // Log individual results for analysis
    Object.entries(apiResults.results).forEach(([entity, result]: [string, any]) => {
      console.log(`\n📊 ${entity.toUpperCase()}:`);
      console.log(`  - Éxito: ${result.success}`);
      console.log(`  - Campos enviados: ${result.requiredFields?.join(', ') || 'N/A'}`);
      if (result.error) {
        console.log(`  - Error: ${result.error}`);
      }
    });
  });
});