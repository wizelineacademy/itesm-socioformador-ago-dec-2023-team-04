import {PrismaClient} from '@prisma/client';

// eslint-disable-next-line import/no-mutable-exports
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	// @ts-expect-error global has no type
	if (!global.prisma) {
		// @ts-expect-error global has no type
		global.prisma = new PrismaClient();
	}

	// @ts-expect-error global has no type
	prisma = global.prisma as PrismaClient;
}

export default prisma;
