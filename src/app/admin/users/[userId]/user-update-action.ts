import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {decodeForm} from '@/lib/schemas/util.ts';
import {userRegistrationSchema} from '@/lib/schemas/user.ts';
import prisma from '@/lib/prisma.ts';
import {management} from '@/lib/auth0.ts';

/**
 * Updates a user in the system.
 *
 * @param {FormData} formData - The form data containing the user update details.
 *
 * @returns {Promise<ServerActionResult>} A Promise that resolves to a ServerActionResult object indicating the result of the operation.
 */
export default async function updateUser(formData: FormData): Promise<ServerActionResult> {
    try {
        const updatedData = await decodeForm(formData, userRegistrationSchema);

        const user = await prisma.user.update({
            where: {
                id: updatedData.id,
            },
            data: updatedData,
        });

        await management.users.update({
            id: user.authId,
            data: updatedData,
        });

        return {
            success: true,
        };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                name: error.name,
                message: error.message,
            };
        }

        return {
            success: false,
            message: 'unknown server error',
        };
    }
}


