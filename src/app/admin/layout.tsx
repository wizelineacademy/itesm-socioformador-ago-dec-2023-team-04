import React from "react";
import Link from 'next/link';
import Separator from '@/components/Separator';
import AdminNavigationLink from '@/components/AdminNavigationLink';

export default function AdminLayout({children}: {
    children: React.ReactNode
}) {
    return <div className="flex w-full justify-center text-stone-300 px-4">
        <main className="w-full max-w-5xl flex py-8 gap-4">
            <nav className="basis-48 flex-none flex flex-col gap-2">
                <AdminNavigationLink slug={null}>
                    Configuración general
                </AdminNavigationLink>
                <AdminNavigationLink slug='users'>
                    Usuarios
                </AdminNavigationLink>
            </nav>
            <div >
                {children}
            </div>
        </main>
    </div>
}
