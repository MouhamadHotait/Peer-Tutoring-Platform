const swaggerJsdoc = require('swagger-jsdoc');

// Swagger (OpenAPI) setup: builds the API documentation from comments in our code
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Peer Tutoring & Study Groups API',
      version: '1.0.0',
      description: 'Backend API for the Null & Void peer tutoring platform (CSC443 Phase 2)',
    },
    servers: [{ url: '/' }], // same server the docs are served from (works locally and on Render)

    components: {
      // Lets us test protected routes: click "Authorize" and paste a JWT
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },

      // Shared data shapes, reused by everyone's route docs with $ref
      schemas: {
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            code: { type: 'string', example: 'CSC443' },
            name: { type: 'string', example: 'Web Programming' },
            subject: { type: 'string', example: 'Computer Science' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Lara Haddad' },
            email: { type: 'string', example: 'lara@lau.edu' },
            major: { type: 'string', example: 'Computer Science' },
            bio: { type: 'string', example: 'Senior student who loves web development.' },
          },
        },
        Session: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string', example: 'React Hooks Crash Course' },
            course: { $ref: '#/components/schemas/Course' },
            host: { $ref: '#/components/schemas/User' },
            type: { type: 'string', enum: ['tutoring', 'study-group'] },
            date: { type: 'string', example: '2026-12-05' },
            time: { type: 'string', example: '17:00' },
            mode: { type: 'string', enum: ['online', 'in-person'] },
            location: { type: 'string', example: 'Library, Room 204' },
            capacity: { type: 'integer', example: 10 },
            attendees: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            description: { type: 'string', example: 'We go over useState and useEffect.' },
          },
        },
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
  },

  // Files where Swagger looks for route documentation comments
  apis: ['./server.js', './routes/*.js'],
};

module.exports = swaggerJsdoc(options);