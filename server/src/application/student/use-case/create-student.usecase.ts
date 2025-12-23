import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { STUDENT_REPOSITORY } from '../../../domain/student/repository.port';
import type { StudentRepositoryPort } from '../../../domain/student/repository.port';
import { StudentEntity } from '../../../domain/student/entity/student.entity';
import { CreateStudentInput } from '../dto/create-student.input';
import { StudentOutput, mapEntityToOutput } from '../dto/student.output';
import { DuplicateError, Exceptions } from '../../../domain/student/exceptions';

@Injectable()
export class CreateStudentUseCase {
    constructor(
        @Inject(STUDENT_REPOSITORY)
        private readonly repository: StudentRepositoryPort,
    ) { }

    async execute(
        input: CreateStudentInput,
        createdBy: string,
    ): Promise<StudentOutput> {
        // Check for duplicate RUT
        const existingByRut = await this.repository.findByRut(input.rut);
        if (existingByRut) {
            throw new DuplicateError(
                Exceptions.STUDENT_DUPLICATE_RUT.description.replace('${0}', input.rut),
                Exceptions.STUDENT_DUPLICATE_RUT.code,
                { rut: input.rut },
            );
        }

        // Check for duplicate email
        const existingByEmail = await this.repository.findByEmail(input.email);
        if (existingByEmail) {
            throw new DuplicateError(
                Exceptions.STUDENT_DUPLICATE_EMAIL.description.replace(
                    '${0}',
                    input.email,
                ),
                Exceptions.STUDENT_DUPLICATE_EMAIL.code,
                { email: input.email },
            );
        }

        // Generate UUID
        const id = randomUUID();

        // Create entity (validations happen in constructor)
        const entity = new StudentEntity(
            id,
            input.rut,
            input.firstName,
            input.lastName,
            input.email,
            input.phone,
            new Date(input.birthDate),
            input.grade,
            input.section,
            input.address,
            {
                name: input.emergencyContact.name,
                phone: input.emergencyContact.phone,
                relationship: input.emergencyContact.relationship,
            },
            'ACTIVO',
            input.enrollmentDate ? new Date(input.enrollmentDate) : new Date(),
            new Date(),
            createdBy,
        );

        // Save to repository
        const savedEntity = await this.repository.save(entity);

        return mapEntityToOutput(savedEntity);
    }
}
