'use client';
import React from "react";
import {Button as BaseButton, ButtonProps} from '@mui/base';
import Link from "next/link";
import clsx from 'clsx';
import {useSelectedLayoutSegment} from 'next/navigation';
import {Button} from '@/components/Button';

export const SidebarButton = React.forwardRef(
    ({
         className,
         href,
         slots,
         ...props
     }: {
        href: string,
    } & React.ComponentProps<typeof Button>, ref: React.ForwardedRef<HTMLButtonElement>) => {
        const layoutSegment = useSelectedLayoutSegment();
        const selected = (layoutSegment == null && href === '/') || href === `/${layoutSegment}`;
        return <Link href={href}>
            <Button {...props}
                    variant='tertiary'
                    className={clsx(selected && 'bg-wRed-600 hover:bg-wRed-600', className)}
                    ref={ref}/>
        </Link>


    }
)
