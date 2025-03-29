import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twinkl TypeScript Test API',
      version: '1.0.0',
      description: 'API documentation for Twinkl TypeScript Test',
    },
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['fullName', 'email', 'password', 'userType'],
          properties: {
            id: {
              type: 'string',
              description: 'Auto-generated user ID',
            },
            fullName: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
            },
            userType: {
              type: 'string',
              enum: ['student', 'teacher', 'parent', 'private tutor'],
              description: 'Type of user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date',
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            fullName: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            userType: {
              type: 'string',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
        },
        ValidationErrors: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: { type: 'string' },
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
