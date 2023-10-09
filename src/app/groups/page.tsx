import React from "react";

function GroupCard({ groupName, numStudents, numProfessors }) {
    return (
        <div className="mr-2 block rounded-sm bg-stone-800 shrink-0 h-36">
            <div className="p-6">
                <h5 className="mb-2 text-xl font-medium leading-tight text-center text-gray-200">
                    {groupName}
                </h5>
                <div className="flex items-center justify-center text-gray-300">
                    <p className="mb-2 text-base mr-28">{numStudents}</p>
                    <p className="mb-2 text-base">{numProfessors}</p>
                </div>
                <div className="flex items-center justify-center text-stone-400">
                    <p className="mb-2 text-base mr-12">Alumnos</p>
                    <p className="mb-2 text-base">Profesor(es)</p>
                </div>
            </div>
        </div>
    );
}

export default function Groups() {
    return (
        <main>
            <div className="p-16 text-stone-300 min-h-screen flex flex-col">
                <h1 className="text-4xl mb-4 text-slate-200">Grupos</h1>
                <div className="justify-center">
                    <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-4 flex-1 h-36 w-364">
                        <GroupCard groupName="Grupo A" numStudents="6" numProfessors="1" />
                        <GroupCard groupName="Grupo B" numStudents="6" numProfessors="1" />
                        <GroupCard groupName="Grupo C" numStudents="6" numProfessors="1" />
                        <GroupCard groupName="Grupo D" numStudents="6" numProfessors="1" />
                    </div>
                </div>
            </div>
        </main>
    );
}

