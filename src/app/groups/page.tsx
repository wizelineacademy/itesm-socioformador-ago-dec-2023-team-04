import React from "react";

export default function Home() {
    return (
        <main className="w-full">
            <h1 className="text-4xl mb-4 text-slate-100 color: rgb(212 212 216) decoration-2 pt-3 padding-top: px-14rem">
                Grupos
            </h1>
            <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-2">
                <div className="mr-4 block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-gray-300">
                    <div className="p-6">
                        <h5 className="mb-2 text-xl font-medium leading-tight text-center">
                            Grupo A
                        </h5>
                        <div className="flex items-center justify-center">
                            <p className="mb-2 text-base mr-28">
                                6
                            </p>
                            <p className="mb-2 text-base">
                                1
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="mb-2 text-base mr-12">
                                Alumnos
                            </p>
                            <p className="mb-2 text-base">
                                Profesor(es)
                            </p>
                        </div>
                    </div>
                </div>
                <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] bg-gray-300">
                    <div className="p-6">
                        <h5 className="mb-2 text-xl font-medium leading-tight text-center">
                            Grupo B
                        </h5>
                        <div className="flex items-center justify-center">
                            <p className="mb-2 text-base">
                                Alumnos
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <p className="mb-2 text-base">
                                Profesor(es)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

