'use client'
import React, { useState } from 'react';

export default Groups;

// Card Component for Groups
function GroupCard({ groupName, numStudents, numProfessors }: { groupName: string; numStudents: number; numProfessors: number }) {
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

function Groups() {
    //const client = useClient();
    const [groups, setGroups] = useState<Array<{ groupName: string; numStudents: number; numProfessors: number; groupColor: string; }>>([]);
    const [groupName, setGroupName] = useState("");
    const [groupColor, setGroupColor] = useState("");
    const [isAddingGroup, setIsAddingGroup] = useState(false);


    const handleAddGroup = () => {
        setIsAddingGroup(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create a new group object with name and color
        const newGroup = {
            groupName,
            numStudents: 0, // Student Values
            numProfessors: 0, // Professor Values
            groupColor,
        };
        // Update the groups state with the new group
        setGroups([...groups, newGroup]);
        // Reset the form fields and close the form
        setGroupName("");
        setGroupColor("");
        setIsAddingGroup(false);
    };

    return (
        <main>
            <div className="p-16 text-stone-300 min-h-screen flex flex-col">
                <h1 className="text-4xl mb-4 text-slate-200">Grupos</h1>
                <div className="justify-center">
                    <button onClick={handleAddGroup} className="mb-4">
                        Add Group
                    </button>

                    {/* Render the form when isAddingGroup is true */}
                    {isAddingGroup && (
                        <form onSubmit={handleSubmit}>
                            <label>
                                Group Name:
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </label>
                            <label>
                                Group Color:
                                <input
                                    type="text"
                                    value={groupColor}
                                    onChange={(e) => setGroupColor(e.target.value)}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </form>
                    )}

                    <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-4 flex-1 h-36 w-364">
                        {/* Map through the groups and render GroupCard components */}
                        {groups.map((group, index) => (
                            <GroupCard
                                key={index}
                                groupName={group.groupName}
                                numStudents={group.numStudents}
                                numProfessors={group.numProfessors}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
