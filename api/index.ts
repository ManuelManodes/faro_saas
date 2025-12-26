import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../server/src/app.module';
import express, { Express } from 'express';

// Cache the NestJS app instance for reuse across requests
let cachedApp: Express | null = null;

async function bootstrap(): Promise<Express> {
    // Return cached instance if available (optimization for cold starts)
    if (cachedApp) {
        return cachedApp;
    }

    // Create Express instance
    const expressApp = express();

    // Create NestJS application with Express adapter
    const app: INestApplication = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn', 'log'] }
    );

    // Enable CORS for all origins (adjust in production if needed)
    app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization,x-user-email,x-api-key',
    });

    // Set global prefix for API routes
    app.setGlobalPrefix('api');

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    // Swagger documentation setup
    const config = new DocumentBuilder()
        .setTitle('EduSaaS API')
        .setDescription('Educational SaaS Platform API - Serverless')
        .setVersion('1.0')
        .addTag('students')
        .addTag('courses')
        .addTag('attendance')
        .addTag('holland-test')
        .addTag('calendar-events')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Initialize the app
    await app.init();

    // Cache the Express app for reuse
    cachedApp = expressApp;

    return expressApp;
}

// Vercel serverless function handler
export default async (req: any, res: any) => {
    try {
        const app = await bootstrap();
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
