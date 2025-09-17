import axios from 'axios';
import express from 'express'
import Joi from 'joi'
import dotenv from 'dotenv'
import {rateLimit} from 'express-rate-limit'
import { Redis } from '@upstash/redis';
import { swaggerSpec, swaggerUi } from './swagger.js';

dotenv.config()

const app = express();

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const schema = Joi.object({
    code: Joi.number().required()
})

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

app.use(express.urlencoded())
app.use(express.json())

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * /weather/{code}:
 *   get:
 *     summary: Get weather info using city code
 *     description: Returns city weather information
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: city code
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: A weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 */
app.get('/weather/:code', limiter, async (req, res) => {
    const params = schema.validate(req.params)

    const code = params.value.code

    const apiKey = process.env.WEATHER_API_KEY;
    const cityCode = `City:${code}`;
    const unitGroup = 'metric';
    const contentType = 'json';

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode}?key=${apiKey}&unitGroup=${unitGroup}&contentType=${contentType}`

    
    try {
        const codePresent = await redis.get(cityCode)
    
        if(codePresent) {
            return res.json({
                success: true,
                message: codePresent
            })
        }
        
        const response = await axios.get(url)
        
        const message = response?.data
        
        redis.set(cityCode, message, { ex: 60 * 60 * 1})

        return res.json({
            success: true,
            message: message
        })
    } catch(err) {
        throw new Error('Error fetching weather...')
    }
})

const port = process.env.PORT

app.listen(port, () => {
    console.log('Server running')
})