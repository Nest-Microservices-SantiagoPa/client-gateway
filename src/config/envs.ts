import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    PRODUCTS_MICROSERVICES_HOTS: string;
    PRODUCTS_MICROSERVICES_PORT: number;

}

const envSchema = joi.object({
    PORT: joi.number().required(),
    PRODUCTS_MICROSERVICES_HOTS: joi.string().required(),
    PRODUCTS_MICROSERVICES_PORT: joi.number().required()
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    productsMicroservicesHost: envVars.PRODUCTS_MICROSERVICES_HOTS,
    productMicroservicesPort: envVars.PRODUCTS_MICROSERVICES_PORT
}