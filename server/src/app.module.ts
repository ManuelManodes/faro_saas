import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentHttpModule } from './interface/http/student/student.http.module';
import { CourseHttpModule } from './interface/http/course/course.http.module';
import { AttendanceHttpModule } from './interface/http/attendance/attendance.http.module';
import { HollandTestHttpModule } from './interface/http/holland-test/holland-test.http.module';
import { CalendarEventHttpModule } from './interface/http/calendar-event/calendar-event.http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/edusaas',
        // Opciones críticas para funciones serverless
        maxPoolSize: 3, // Máximo 3 conexiones (importante para serverless)
        minPoolSize: 1, // Mínimo 1 conexión
        socketTimeoutMS: 30000, // 30 segundos timeout
        serverSelectionTimeoutMS: 10000, // 10 segundos para seleccionar servidor
        connectTimeoutMS: 10000, // 10 segundos para conectar
        heartbeatFrequencyMS: 10000, // Verificar conexión cada 10 segundos
        retryWrites: true, // Retry automático en escrituras
        retryReads: true, // Retry automático en lecturas
        maxIdleTimeMS: 30000, // Cerrar conexiones inactivas después de 30s
      }),
      inject: [ConfigService],
    }),
    StudentHttpModule,
    CourseHttpModule,
    AttendanceHttpModule,
    HollandTestHttpModule,
    CalendarEventHttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
