import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../server/src/app.module';
import express, { Express } from 'express';
import mongoose from 'mongoose';

// Cache para la instancia de la app NestJS
let cachedApp: Express | null = null;
// Flag para tracking de estado de conexión MongoDB
let isMongoConnected = false;

async function bootstrap(): Promise<Express> {
    // Retornar instancia cacheada si existe y MongoDB está conectado
    if (cachedApp && isMongoConnected) {
        console.log('✅ Reutilizando app cacheada con MongoDB conectado');
        return cachedApp;
    }

    console.log('🚀 Iniciando bootstrap de la aplicación...');

    // Crear instancia de Express
    const expressApp = express();

    // Crear aplicación NestJS con Express adapter
    const app: INestApplication = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
            logger: ['error', 'warn', 'log'],
            bufferLogs: true
        }
    );

    // Habilitar CORS para todos los orígenes
    app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization,x-user-email,x-api-key',
    });

    // Establecer prefijo global para rutas API
    app.setGlobalPrefix('api');

    // Pipe de validación global
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        })
    );

    // Configuración de Swagger (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
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
    }

    // Inicializar la aplicación
    await app.init();

    // Event listeners para monitorear estado de MongoDB
    mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB conectado exitosamente');
        isMongoConnected = true;
    });

    mongoose.connection.on('error', (err) => {
        console.error('❌ Error de conexión MongoDB:', err);
        isMongoConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB desconectado');
        isMongoConnected = false;
    });

    // Cachear la app para reutilización
    cachedApp = expressApp;
    console.log('✅ App cacheada exitosamente');

    return expressApp;
}

// Handler de función serverless para Vercel
export default async (req: any, res: any) => {
    try {
        const startTime = Date.now();

        // Bootstrap de la aplicación
        const app = await bootstrap();

        const bootstrapTime = Date.now() - startTime;
        console.log(`⏱️ Tiempo de bootstrap: ${bootstrapTime}ms`);

        // Manejar la request
        return app(req, res);
    } catch (error) {
        console.error('❌ Error en función serverless:', error);

        // Resetear caché en caso de error crítico
        cachedApp = null;
        isMongoConnected = false;

        return res.status(500).json({
            statusCode: 500,
            message: 'Error interno del servidor',
            error: error instanceof Error ? error.message : 'Error desconocido',
            timestamp: new Date().toISOString(),
        });
    }
};
