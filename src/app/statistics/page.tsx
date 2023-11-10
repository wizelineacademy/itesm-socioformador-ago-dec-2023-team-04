'use client';
import React, {useState} from 'react';
import {type DateValue} from '@internationalized/date';
import {Input} from '@/components/input.tsx';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import {DateRangePicker} from '@/components/date-range-picker.tsx';
import {dateSchema} from '@/lib/statistics.ts';
import Select from '@/components/select.tsx';
import {Item} from "react-stately";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function Home() {
    const data = [];
    const [group, selectedGroup, setSelectedGroup] = useState(-1);

    return (
        <main className='flex flex-col h-full text-stone-400'>
            <div className='flex items-top mb-4 gap-4'>
                <h1 className='text-4xl text-stone-50'>
                    Estadísticas
                </h1>
            </div>
            <div className='flex flex-col gap-4 h-full p-4'>
                <div className='bg-stone-800 grow rounded'>
                    <RadioGroup label='Seleccione uno'>
                        <Radio value='entry'>Registro de entradas</Radio>
                        <Radio value='exit'>Registro de salidas</Radio>
                    </RadioGroup>
                    <DateRangePicker
                        label='Seleccione un intérvalo de fechas'/>
                    <Select
                        label='Grupo'
                        items={group} selectedKey={selectedGroup} onSelectionChange={key => {
                        setSelectedGroup(key as number);
                    }}
                        {
                            item => (
                                <Item key={item.id}>
                                    {item.group.name}
                                </Item>
                            )
                        }
                    <div> Gráfica</div>
            </div>
        </div>
</main>
)
    ;
}
