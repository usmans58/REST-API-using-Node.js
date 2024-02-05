import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    info: {
      title: 'Rest API Documentation',
      version: '1.0.0',
      description: 'Documentation for Rest API',
    },
  },
  apis: ['./typescript.ts'], // Update this line
};

export default swaggerOptions;
