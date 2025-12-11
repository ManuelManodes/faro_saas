export interface Student {
    id: string;
    name: string;
}

export interface Course {
    id: string;
    name: string;
    grad: string;
    students: Student[];
}

export const COURSES: Course[] = [
    {
        id: "c1",
        name: "Matemáticas II",
        grad: "1° Medio A",
        students: [
            { id: "s1", name: "Valentina Muñoz" },
            { id: "s2", name: "Benjamín Soto" },
            { id: "s3", name: "Martina González" },
            { id: "s4", name: "Joaquín Pérez" },
            { id: "s5", name: "Sofía Herrera" },
            { id: "s6", name: "Lucas Rojas" },
            { id: "s7", name: "Catalina Díaz" },
            { id: "s8", name: "Felipe Castro" },
        ]
    },
    {
        id: "c2",
        name: "Historia Universal",
        grad: "2° Medio B",
        students: [
            { id: "s9", name: "Javiera Silva" },
            { id: "s10", name: "Ignacio Morales" },
            { id: "s11", name: "Fernanda López" },
            { id: "s12", name: "Diego Vargas" },
            { id: "s13", name: "Camila Torres" },
        ]
    }
];
