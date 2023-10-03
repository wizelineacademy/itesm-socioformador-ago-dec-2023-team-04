import React from 'react';
import StudentsTable from '@/components/StudentsTable';
import {getAllStudents} from '@/lib/student';
import Icon from "@/components/Icon";

export default async function Students() {
    const students = await getAllStudents();
    return <main className="w-full gb-stone-900">
        <div className={"p-16 text-stone-300 min-h-screen"}>
            <h1 className="text-4xl">Alumnos</h1>

            <div className={"pt-8 min-h-full grid gap-x-6 grid-cols-2 grid-rows-1 first:col- last:col- justify-items-stretch"}>
                <div className={"p-6 rounded-lg bg-stone-800"}>
                    <StudentsTable students={students} className="w-full"/>
                </div>
                <div className="p-12 rounded-lg bg-stone-800 text-center text-base align-middle">
                    <Icon name="person" className="m-2"/>
                    <p>Ningún alumno seleccionado.
                        Selecione a un alumno para mostrar su información</p>
                </div>
            </div>
        </div>
    </main>
}
