import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    info: {
      title: 'Rest API Documentation',
      version: '1.0.0',
      description: 'Documentation for Rest API',
    },
  },
  apis: ['./dist/typescript.js'], // Adjust the path to match your TypeScript files
};

export default swaggerOptions;
