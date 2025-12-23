import { StudentEntity, ValidationError, EmergencyContact } from '../student.entity';

describe('StudentEntity', () => {
    const validEmergencyContact: EmergencyContact = {
        name: 'María González',
        phone: '+56912345678',
        relationship: 'madre',
    };

    const createValidStudent = (overrides?: Partial<any>) => {
        return new StudentEntity(
            '550e8400-e29b-41d4-a716-446655440000',
            '12345678-5', // RUT válido con dígito verificador correcto
            'Juan',
            'Pérez',
            'juan.perez@estudiante.cl',
            '+56912345678',
            new Date('2010-03-15'), // 14 años
            '8° Básico',
            'A',
            'Av. Principal 123, Santiago',
            validEmergencyContact,
            'ACTIVO',
            new Date('2020-03-01'),
            new Date('2024-01-15'),
            'admin@colegio.cl',
            overrides?.updatedAt,
            overrides?.updatedBy,
        );
    };

    describe('Casos válidos (happy path)', () => {
        it('debe crear una entidad de estudiante válida', () => {
            const student = createValidStudent();

            expect(student.id).toBe('550e8400-e29b-41d4-a716-446655440000');
            expect(student.rut).toBe('12345678-5');
            expect(student.firstName).toBe('Juan');
            expect(student.lastName).toBe('Pérez');
            expect(student.status).toBe('ACTIVO');
        });

        it('debe calcular correctamente el nombre completo', () => {
            const student = createValidStudent();
            expect(student.fullName).toBe('Juan Pérez');
        });

        it('debe calcular correctamente la edad', () => {
            const student = createValidStudent();
            // La edad depende de la fecha actual, pero debería estar entre 13-15 años
            expect(student.age).toBeGreaterThanOrEqual(13);
            expect(student.age).toBeLessThanOrEqual(15);
        });

        it('debe indicar correctamente si está activo', () => {
            const studentActivo = createValidStudent();
            expect(studentActivo.isActive).toBe(true);

            // Crear con estado INACTIVO
            const studentInactivo = new StudentEntity(
                '550e8400-e29b-41d4-a716-446655440000',
                '12345678-5',
                'Juan',
                'Pérez',
                'juan.perez@estudiante.cl',
                '+56912345678',
                new Date('2010-03-15'),
                '8° Básico',
                'A',
                'Av. Principal 123, Santiago',
                validEmergencyContact,
                'INACTIVO',
                new Date('2020-03-01'),
                new Date('2024-01-15'),
                'admin@colegio.cl',
            );
            expect(studentInactivo.isActive).toBe(false);
        });

        it('debe aceptar RUT con dígito verificador K', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '24225788-K', // RUT real válido con K
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).not.toThrow();
        });

        it('debe aceptar todos los grados válidos', () => {
            const validGrades = [
                'Pre-kínder',
                'Kínder',
                '1° Básico',
                '2° Básico',
                '3° Básico',
                '4° Básico',
                '5° Básico',
                '6° Básico',
                '7° Básico',
                '8° Básico',
                '1° Medio',
                '2° Medio',
                '3° Medio',
                '4° Medio',
            ];

            validGrades.forEach((grade) => {
                expect(() => {
                    new StudentEntity(
                        '550e8400-e29b-41d4-a716-446655440000',
                        '12345678-5',
                        'Juan',
                        'Pérez',
                        'juan.perez@estudiante.cl',
                        '+56912345678',
                        new Date('2010-03-15'),
                        grade,
                        'A',
                        'Av. Principal 123, Santiago',
                        validEmergencyContact,
                        'ACTIVO',
                        new Date('2020-03-01'),
                        new Date('2024-01-15'),
                        'admin@colegio.cl',
                    );
                }).not.toThrow();
            });
        });
    });

    describe('Validación de RUT', () => {
        it('debe rechazar RUT sin guion', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '123456785',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('RUT debe tener formato válido: 12345678-9');
        });

        it('debe rechazar RUT con formato incorrecto', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '1234-5678-9',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('RUT debe tener formato válido');
        });

        it('debe rechazar RUT con dígito verificador incorrecto', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-0', // Dígito incorrecto (debería ser 5)
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('RUT inválido: dígito verificador incorrecto');
        });

        it('debe rechazar RUT muy corto', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '123-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('RUT debe tener formato válido');
        });
    });

    describe('Validación de nombres', () => {
        it('debe rechazar firstName muy corto', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'J',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('firstName debe tener entre 2 y 100 caracteres');
        });

        it('debe rechazar firstName muy largo', () => {
            const longName = 'A'.repeat(101);
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    longName,
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('firstName debe tener entre 2 y 100 caracteres');
        });

        it('debe rechazar lastName vacío', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    '',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('lastName debe tener entre 2 y 100 caracteres');
        });
    });

    describe('Validación de email', () => {
        it('debe rechazar email sin @', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perezestudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Email debe tener formato válido');
        });

        it('debe rechazar email sin dominio', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Email debe tener formato válido');
        });

        it('debe rechazar email sin extensión', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Email debe tener formato válido');
        });
    });

    describe('Validación de teléfono', () => {
        it('debe rechazar teléfono sin prefijo +56', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Teléfono debe tener formato +56XXXXXXXXX (9 dígitos)');
        });

        it('debe rechazar teléfono con menos de 9 dígitos', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+5691234567',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Teléfono debe tener formato +56XXXXXXXXX (9 dígitos)');
        });

        it('debe rechazar teléfono con más de 9 dígitos', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+569123456789',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Teléfono debe tener formato +56XXXXXXXXX (9 dígitos)');
        });

        it('debe rechazar teléfono con letras', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+5691234567A',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Teléfono debe tener formato +56XXXXXXXXX (9 dígitos)');
        });
    });

    describe('Validación de edad', () => {
        it('debe rechazar estudiante menor de 4 años', () => {
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - 3); // 3 años

            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    birthDate,
                    'Pre-kínder',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('La edad del estudiante debe estar entre 4 y 25 años');
        });

        it('debe rechazar estudiante mayor de 25 años', () => {
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - 26); // 26 años

            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    birthDate,
                    '4° Medio',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('La edad del estudiante debe estar entre 4 y 25 años');
        });

        it('debe aceptar estudiante de 4 años (edad mínima)', () => {
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - 4);

            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    birthDate,
                    'Pre-kínder',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).not.toThrow();
        });

        it('debe aceptar estudiante de 25 años (edad máxima)', () => {
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - 25);

            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    birthDate,
                    '4° Medio',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).not.toThrow();
        });
    });

    describe('Validación de grado', () => {
        it('debe rechazar grado inválido', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '5° Medio', // No existe
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Grado debe ser uno de:');
        });
    });

    describe('Validación de sección', () => {
        it('debe rechazar sección con minúsculas', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'a',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Sección debe ser una o dos letras mayúsculas');
        });

        it('debe rechazar sección con números', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    '1',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Sección debe ser una o dos letras mayúsculas');
        });

        it('debe aceptar sección de dos letras', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'AA',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).not.toThrow();
        });
    });

    describe('Validación de dirección', () => {
        it('debe rechazar dirección muy corta', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Ave',
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Dirección debe tener entre 5 y 200 caracteres');
        });

        it('debe rechazar dirección muy larga', () => {
            const longAddress = 'A'.repeat(201);
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    longAddress,
                    validEmergencyContact,
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Dirección debe tener entre 5 y 200 caracteres');
        });
    });

    describe('Validación de contacto de emergencia', () => {
        it('debe rechazar contacto con nombre muy corto', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    {
                        name: 'Ma',
                        phone: '+56912345678',
                        relationship: 'madre',
                    },
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Nombre de contacto de emergencia debe tener entre 3 y 100 caracteres');
        });

        it('debe rechazar contacto con teléfono inválido', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    {
                        name: 'María González',
                        phone: '912345678', // Sin +56
                        relationship: 'madre',
                    },
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Teléfono de contacto debe tener formato +56XXXXXXXXX (9 dígitos)');
        });

        it('debe rechazar contacto sin relación especificada', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    {
                        name: 'María González',
                        phone: '+56912345678',
                        relationship: '',
                    },
                    'ACTIVO',
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Relación de contacto de emergencia debe especificarse');
        });
    });

    describe('Validación de estado', () => {
        it('debe rechazar estado inválido', () => {
            expect(() => {
                new StudentEntity(
                    '550e8400-e29b-41d4-a716-446655440000',
                    '12345678-5',
                    'Juan',
                    'Pérez',
                    'juan.perez@estudiante.cl',
                    '+56912345678',
                    new Date('2010-03-15'),
                    '8° Básico',
                    'A',
                    'Av. Principal 123, Santiago',
                    validEmergencyContact,
                    'SUSPENDIDO' as any,
                    new Date('2020-03-01'),
                    new Date('2024-01-15'),
                    'admin@colegio.cl',
                );
            }).toThrow('Estado debe ser uno de: ACTIVO, INACTIVO, RETIRADO');
        });

        it('debe aceptar todos los estados válidos', () => {
            const validStatuses = ['ACTIVO', 'INACTIVO', 'RETIRADO'];

            validStatuses.forEach((status) => {
                expect(() => {
                    new StudentEntity(
                        '550e8400-e29b-41d4-a716-446655440000',
                        '12345678-5',
                        'Juan',
                        'Pérez',
                        'juan.perez@estudiante.cl',
                        '+56912345678',
                        new Date('2010-03-15'),
                        '8° Básico',
                        'A',
                        'Av. Principal 123, Santiago',
                        validEmergencyContact,
                        status as any,
                        new Date('2020-03-01'),
                        new Date('2024-01-15'),
                        'admin@colegio.cl',
                    );
                }).not.toThrow();
            });
        });
    });
});
