import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import type { RegisterInput } from './auth.schemas.js';

export class AuthService {
    async register(data: RegisterInput) {
        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (userAlreadyExists) {
            throw new Error('Email already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 8);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash,
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        return user;
    }
}