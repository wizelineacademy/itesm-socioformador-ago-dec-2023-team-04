'use client';
import React from "react";
import {Button as BaseButton, ButtonProps} from '@mui/base';
import Link from "next/link";
import clsx from 'clsx';
import {useSelectedLayoutSegment} from 'next/navigation';

export const SidebarButton = React.forwardRef(
    ({
         className,
         label,
         iconName,
         href,
         slots,
         ...props
     }: {
        label: string,
        href: string,
        iconName?: string,
    } & ButtonProps & React.ComponentProps<typeof Link>, ref: React.ForwardedRef<HTMLButtonElement>) => {
        const layoutSegment = useSelectedLayoutSegment();
        const selected = (layoutSegment == null && href === '/') || href === `/${layoutSegment}`;
        return <BaseButton {...props}
                           href={href}
                           className={clsx("flex items-center text-stone-300 p-2 w-fit rounded", selected && 'bg-wRed-600', !selected && 'hover:bg-stone-700', className)}
                           ref={ref} slots={{
            ...slots,
            root: Link,
        }}>
            <span className='material-symbols-rounded me-2'>{iconName}</span>
            {label}
        </BaseButton>

    }
)
