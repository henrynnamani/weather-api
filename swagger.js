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
          url: 'https://weather-api-m1ys.onrender.com',
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