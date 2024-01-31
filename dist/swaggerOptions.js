"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Rest API Documentation',
            version: '1.0.0',
            description: 'Documentation for Rest API',
        },
    },
    apis: ['./dist/typescript.js'], 
};
exports.default = swaggerOptions;
