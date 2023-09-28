"use client"
import {createColumnHelper, getCoreRowModel} from '@tanstack/table-core';
import {User} from '@prisma/client';
import {flexRender, useReactTable} from '@tanstack/react-table';
import clsx from 'clsx';

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.accessor('email', {
        header: 'Correo electrónico',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('givenName', {
        header: 'Nombre(s)',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('familyName', {
        header: 'Apellidos(s)',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('admin', {
        header: 'Tipo de usuario',
        cell: info => info.getValue() ? 'Administrador' : 'Usuario',
    }),
]

export default function UserAdminTable({users, className}: { users: User[], className?: string }) {
    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return <table className={clsx(className)}>
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                    <th key={header.id} className='text-left'>
                        {
                            header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                        }
                    </th>
                ))}
            </tr>
        ))}
        </thead>
        <tbody>
        {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
            </tr>
        ))}
        </tbody>
    </table>
}
