import React from "react";
import {Button as BaseButton, ButtonProps} from '@mui/base';
import Link from "next/link";
import clsx from 'clsx';

export const SidebarButton = React.forwardRef(
    ({
         className,
         label,
         iconName,
         slots,
         ...props
     }: {
        label: string,
        href: string,
        iconName?: string,
    } & ButtonProps & React.ComponentProps<typeof Link>, ref: React.ForwardedRef<HTMLButtonElement>) => {
        return <BaseButton {...props} className={clsx("flex items-center text-stone-300 p-2 w-fit", className)} ref={ref} slots={{
            ...slots,
            root: Link,
        }}>
            <span className='material-symbols-rounded me-2'>{iconName}</span>
            {label}
        </BaseButton>

    }
)
