'use client';
import React from "react";
import {Button as BaseButton, ButtonProps} from '@mui/base';
import clsx from 'clsx';

export const Button = React.forwardRef(
    ({
         className,
         label,
         size = 'md',
         variant = 'primary',
         iconName,
         ...props
     }: {
        label: string,
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
        variant?: 'primary' | 'secondary' | 'tertiary',
        iconName?: string,
    } & ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
        return <BaseButton {...props}
                           className={clsx(className,
                               "flex items-center text-stone-300  w-fit rounded ",
                               variant === 'primary' && "bg-wRed-600 hover:bg-wRed-500",
                               variant === 'secondary' && "",
                               variant === 'tertiary' && "hover:bg-stone-700",
                               size === 'xs' && "text-xs p-1",
                               size === 'sm' && "text-sm p-1",
                               size === 'md' && "text-md p-2",
                               size === 'lg' && "text-md p-3",
                               size === 'xl' && "text-md p-4",
                           )}
                           ref={ref}>
            {
                iconName ? <span className='material-symbols-rounded me-2'>{iconName}</span> : null
            }
            {label}
        </BaseButton>

    }
)
