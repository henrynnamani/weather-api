import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Weather API',
        version: '1.0.0',
        description: 'API documentation for my Express app',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./index.js'],
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  export {
    swaggerUi,
    swaggerSpec
  }