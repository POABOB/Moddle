const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config()
const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./api/main.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

const doc = {
    info: {
        "version": "1.0",                // by default: "1.0.0"
        "title": "Moodle 後端API Document",                  // by default: "REST API"
        "description": ""             // by default: ""
    },
    host: process.env.BASE_SERVER_URL + ':' + process.env.PORT,                         // by default: "localhost:3000"
    basePath: "/",                     // by default: "/"
    schemes: ["http"],                      // by default: ['http']
    consumes: ['application/json'],                     // by default: ['application/json']
    produces: ['application/json'],                     // by default: ['application/json']
    tags: [                           // by default: empty Array
        {
            "name": "User",               // Tag name
            "description": "使用者相關API"         // Tag description
        },
        {
            "name": "Game",               // Tag name
            "description": "遊戲相關API"         // Tag description
        }
    ],
    securityDefinitions: {
        Bearer: {
            in: "header",
            name: "Authorization",
            type: "apiKey",
            description: "後端驗證的JWT"
        }
    },         // by default: empty object
    definitions: { }                  // by default: empty object
}

swaggerAutogen(outputFile, endpointsFiles, doc)