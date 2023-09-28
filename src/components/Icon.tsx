import React from 'react';
import clsx from 'clsx';

export default function Icon({name, className, ...props}: { name: string } & React.ComponentProps<'span'>) {
    return <span {...props} className={clsx('material-symbols-rounded', className)}>{name}</span>
}
