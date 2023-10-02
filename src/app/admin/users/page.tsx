import React from 'react';
import UserAdminTable from '@/components/UserAdminTable';
import {getAllUsers} from '@/lib/user';

export default async function Users() {
    const users = await getAllUsers();
    return <div>
        <h1 className='text-4xl mb-4'>
            Usuarios
        </h1>

        <div className='bg-stone-800 p-4 rounded'>
            <UserAdminTable users={users} className='w-full'/>
        </div>
    </div>
}
