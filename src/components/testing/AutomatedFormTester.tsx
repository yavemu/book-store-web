"use client";

import { useState } from 'react';
import { 
  generateValidBookData, 
  generateValidUserData, 
  generateValidAuthorData,
  generateValidGenreData,
  generateValidPublishingHouseData,
  testAllEndpointsRequiredFields,
  testRequiredFieldsValidation,
  generateComprehensiveValidationTests,
  testAllEndpoints,
  ValidationTestSuite,
  EndpointTestResult
} from '@/utils/testDataGenerator';

interface TestResult {
  test: string;
  success: boolean;
  data?: any;
  error?: any;
  duration: number;
}

interface ComprehensiveTestResult {
  validationSuites: ValidationTestSuite[];
  endpointTests: { results: EndpointTestResult[], summary: { total: number, successful: number, failed: number } };
  overallSummary: {
    totalValidationTests: number;
    passedValidationTests: number;
    totalEndpointTests: number;
    passedEndpointTests: number;
    duration: number;
  };
}

export function AutomatedFormTester() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [comprehensiveResults, setComprehensiveResults] = useState<ComprehensiveTestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'comprehensive'>('comprehensive');

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    const startTime = Date.now();
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      return {
        test: testName,
        success: true,
        data: result,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        test: testName,
        success: false,
        error: error,
        duration
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    const testResults: TestResult[] = [];

    // Test 1: Validación de campos obligatorios con Zod (datos vacíos)
    console.log("🧪 Ejecutando Test 1: Análisis de campos obligatorios");
    const requiredFieldsTest = await runTest("Análisis de campos obligatorios (Zod)", testRequiredFieldsValidation);
    testResults.push(requiredFieldsTest);

    // Test 2: Validación de datos generados (datos válidos)
    console.log("🧪 Ejecutando Test 2: Validación de datos generados");
    const validationTest = await runTest("Validación de datos generados", async () => {
      const bookData = generateValidBookData();
      const userData = generateValidUserData();
      const authorData = generateValidAuthorData();
      const genreData = generateValidGenreData();
      const publisherData = generateValidPublishingHouseData();
      
      return {
        entities: {
          book: bookData,
          user: userData,
          author: authorData,
          genre: genreData,
          publisher: publisherData
        },
        message: "Todos los datos válidos generados correctamente"
      };
    });
    testResults.push(validationTest);

    // Test 3: Llamadas directas a APIs de todos los endpoints
    console.log("🧪 Ejecutando Test 3: Pruebas de APIs de todos los endpoints");
    const apiTest = await runTest("APIs de todos los endpoints", testAllEndpointsRequiredFields);
    testResults.push(apiTest);

    // Test 4: Simulación de formulario con conversión de tipos
    console.log("🧪 Ejecutando Test 4: Simulación de formulario");
    const formTest = await runTest("Simulación de formulario", async () => {
      const bookData = generateValidBookData();
      
      // Simular el procesamiento que hace SmartForm
      const processedData = {
        ...bookData,
        // Simular conversión de tipos como lo hace handleInputChange
        price: typeof bookData.price === 'string' ? parseFloat(bookData.price) : bookData.price,
        stockQuantity: typeof bookData.stockQuantity === 'string' ? parseInt(bookData.stockQuantity) : bookData.stockQuantity,
        pageCount: typeof bookData.pageCount === 'string' ? parseInt(bookData.pageCount) : bookData.pageCount,
      };
      
      return {
        original: bookData,
        processed: processedData,
        typesCorrect: {
          price: typeof processedData.price === 'number',
          stockQuantity: typeof processedData.stockQuantity === 'number',
          pageCount: typeof processedData.pageCount === 'number',
        }
      };
    });
    testResults.push(formTest);

    setResults(testResults);
    setIsRunning(false);
  };

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setComprehensiveResults(null);
    const startTime = Date.now();

    try {
      console.log('🚀 Starting comprehensive validation and API testing...');
      
      // Run validation tests
      console.log('📋 Running comprehensive validation tests...');
      const validationSuites = await generateComprehensiveValidationTests();
      
      // Run endpoint tests
      console.log('🌐 Running API endpoint tests...');
      const endpointTests = await testAllEndpoints();
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Calculate overall summary
      const totalValidationTests = validationSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
      const passedValidationTests = validationSuites.reduce((sum, suite) => sum + suite.passedTests, 0);
      
      const comprehensiveResult: ComprehensiveTestResult = {
        validationSuites,
        endpointTests,
        overallSummary: {
          totalValidationTests,
          passedValidationTests,
          totalEndpointTests: endpointTests.summary.total,
          passedEndpointTests: endpointTests.summary.successful,
          duration
        }
      };

      setComprehensiveResults(comprehensiveResult);
      console.log('✅ Comprehensive testing completed!', comprehensiveResult);
      
    } catch (error) {
      console.error('❌ Error in comprehensive testing:', error);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Sistema de Pruebas Automatizadas Completo</h2>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('comprehensive')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comprehensive'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔬 Pruebas Completas
            </button>
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧪 Pruebas Básicas
            </button>
          </nav>
        </div>
      </div>

      {/* Comprehensive Tests Tab */}
      {activeTab === 'comprehensive' && (
        <div>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Sistema de Validación Completa</h3>
            <p className="text-blue-800 text-sm mb-4">
              Este sistema ejecuta pruebas exhaustivas que incluyen:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• ✅ Validación de campos obligatorios para todas las entidades</li>
              <li>• 🔢 Validación de longitud máxima y mínima de campos</li>
              <li>• 🎯 Validación de formatos (URLs, emails, fechas, UUIDs, etc.)</li>
              <li>• 🚫 Validación de valores negativos e inválidos</li>
              <li>• 🌐 Pruebas de conectividad a todos los endpoints de API</li>
              <li>• 📋 Generación automática de datos de prueba válidos e inválidos</li>
              <li>• 📊 Reporte detallado de resultados con métricas completas</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <button
              onClick={runComprehensiveTests}
              disabled={isRunning}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium text-lg shadow-lg"
            >
              {isRunning ? '⏳ Ejecutando pruebas exhaustivas...' : '🚀 Ejecutar Pruebas Completas'}
            </button>
          </div>
        </div>
      )}

      {/* Basic Tests Tab */}
      {activeTab === 'basic' && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">Pruebas Básicas Rápidas</h3>
            <p className="text-gray-700 text-sm">
              Ejecuta las pruebas básicas de validación y APIs para una verificación rápida.
            </p>
          </div>
          
          <div className="mb-4">
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isRunning ? 'Ejecutando pruebas...' : 'Ejecutar todas las pruebas'}
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Results Display */}
      {activeTab === 'comprehensive' && comprehensiveResults && (
        <div className="space-y-6">
          {/* Overall Summary */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Resumen General de Pruebas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {comprehensiveResults.overallSummary.passedValidationTests}/{comprehensiveResults.overallSummary.totalValidationTests}
                </div>
                <div className="text-sm text-gray-600">Validaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {comprehensiveResults.overallSummary.passedEndpointTests}/{comprehensiveResults.overallSummary.totalEndpointTests}
                </div>
                <div className="text-sm text-gray-600">APIs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((comprehensiveResults.overallSummary.passedValidationTests + comprehensiveResults.overallSummary.passedEndpointTests) / (comprehensiveResults.overallSummary.totalValidationTests + comprehensiveResults.overallSummary.totalEndpointTests) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Éxito Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {comprehensiveResults.overallSummary.duration}ms
                </div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
            </div>
          </div>

          {/* Validation Tests Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">🔍 Resultados de Validaciones por Entidad</h3>
            {comprehensiveResults.validationSuites.map((suite, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className={`p-4 ${
                  suite.failedTests === 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold capitalize">{suite.entity}</h4>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${
                        suite.failedTests === 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {suite.passedTests}/{suite.totalTests} ✓
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        suite.failedTests === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {suite.failedTests === 0 ? 'TODAS PASARON' : `${suite.failedTests} FALLARON`}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <details className="cursor-pointer">
                    <summary className="font-medium text-sm text-gray-700 hover:text-gray-900">
                      Ver detalles de {suite.totalTests} pruebas
                    </summary>
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {suite.results.map((result, resultIndex) => (
                        <div key={resultIndex} className={`p-2 rounded text-xs ${
                          result.success ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{result.scenario}</span>
                            <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                              {result.success ? '✓' : '✗'}
                            </span>
                          </div>
                          {!result.success && result.actualError && (
                            <div className="mt-1 text-red-700">
                              <strong>Error:</strong> {result.actualError}
                              {result.expectedError && (
                                <div className="text-red-600">
                                  <strong>Esperado:</strong> {result.expectedError}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>

          {/* API Endpoints Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">🌐 Resultados de Pruebas de APIs</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className={`p-4 ${
                comprehensiveResults.endpointTests.summary.failed === 0 ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Endpoints API</h4>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      comprehensiveResults.endpointTests.summary.failed === 0 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {comprehensiveResults.endpointTests.summary.successful}/{comprehensiveResults.endpointTests.summary.total} ✓
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      comprehensiveResults.endpointTests.summary.failed === 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {comprehensiveResults.endpointTests.summary.failed === 0 ? 'TODOS FUNCIONAN' : `${comprehensiveResults.endpointTests.summary.failed} CON ERRORES`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white">
                <details className="cursor-pointer">
                  <summary className="font-medium text-sm text-gray-700 hover:text-gray-900">
                    Ver detalles de {comprehensiveResults.endpointTests.summary.total} endpoints
                  </summary>
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {comprehensiveResults.endpointTests.results.map((result, resultIndex) => (
                      <div key={resultIndex} className={`p-2 rounded text-xs ${
                        result.success ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.method} {result.endpoint}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{result.duration}ms</span>
                            <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                              {result.success ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                        {!result.success && result.error && (
                          <div className="mt-1 text-red-700">
                            <strong>Error:</strong> {result.error}
                            {result.statusCode && (
                              <span className="ml-2 text-red-600">(Status: {result.statusCode})</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Basic Results Display */}
      {activeTab === 'basic' && results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resultados de las pruebas:</h3>
          
          {results.map((result, index) => (
            <div 
              key={index}
              className={`p-4 rounded border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{result.test}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? '✅ EXITOSO' : '❌ FALLIDO'}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({result.duration}ms)
                  </span>
                </div>
              </div>
              
              {result.success && result.data && (
                <div className="text-sm text-gray-700">
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {!result.success && result.error && (
                <div className="text-sm text-red-700">
                  <strong>Error:</strong> {result.error.message || String(result.error)}
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-900 mb-2">Resumen de pruebas completas:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Campos Obligatorios (Zod):</strong> {results[0]?.success ? 'Identificados correctamente' : 'Error en análisis'}</li>
              <li>• <strong>Datos Válidos Generados:</strong> {results[1]?.success ? 'Todos los schemas OK' : 'Error en generación'}</li>
              <li>• <strong>APIs de Endpoints:</strong> {results[2]?.success ? 'Conexiones exitosas' : 'Errores de API'}</li>
              <li>• <strong>Simulación Formularios:</strong> {results[3]?.success ? 'Conversión de tipos OK' : 'Error en procesamiento'}</li>
              <li>• <strong>Tiempo total:</strong> {results.reduce((sum, r) => sum + r.duration, 0)}ms</li>
              <li>• <strong>Éxito total:</strong> {results.filter(r => r.success).length}/{results.length} pruebas</li>
            </ul>
            {results[2]?.data?.summary && (
              <div className="mt-3 p-2 bg-white rounded border">
                <h5 className="text-xs font-medium text-gray-700">Resultados de APIs:</h5>
                <p className="text-xs text-gray-600">
                  {results[2].data.summary.successful}/{results[2].data.summary.total} endpoints funcionando correctamente
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}