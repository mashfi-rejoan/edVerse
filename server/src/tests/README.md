# Testing Configuration

This directory contains test suites for the edVerse backend API.

## Test Structure

- `models.test.ts` - Database model validation tests
- `admin.test.ts` - Admin API endpoint integration tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Test Database

Tests use a separate test database: `mongodb://localhost:27017/edverse-test`

Configure via `MONGO_URI_TEST` environment variable if needed.

## Test Coverage

Current test coverage includes:

### Models (models.test.ts)
- ✓ Student model creation and validation
- ✓ Academic standing calculation based on CGPA
- ✓ Teacher model creation and workload validation
- ✓ Course model with unique constraints
- ✓ Section model with capacity tracking
- ✓ Enrollment model with grade point calculation

### Admin API (admin.test.ts)
- ✓ Dashboard statistics endpoint
- ✓ Teacher CRUD operations
- ✓ Student CRUD operations
- ✓ Course CRUD operations
- ✓ Authentication and authorization checks

## Adding New Tests

1. Create test file in `src/tests/` directory
2. Follow naming convention: `*.test.ts`
3. Use Jest for test framework
4. Use Supertest for HTTP assertions
5. Clean up test data in `afterEach` hooks
