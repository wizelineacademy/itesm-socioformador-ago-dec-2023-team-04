import React from 'react';
import clsx from 'clsx';

export default function Icon({name, className, ...props}: {readonly name: string; readonly className?: string} & React.ComponentProps<'span'>) {
	return <span {...props} className={clsx('material-symbols-rounded w-6 h-6 leading-none', className)}>{name}</span>;
}
