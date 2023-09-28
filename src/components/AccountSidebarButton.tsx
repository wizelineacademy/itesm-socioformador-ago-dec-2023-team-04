'use client';
import React, {ComponentProps} from "react";
import clsx from 'clsx';
import * as Popover from '@radix-ui/react-popover'
import {Button} from '@/components/Button';

export default function AccountSidebarButton({
                                                 children,
                                                 className,
                                             }: {
    children: React.ReactNode,
    className: string
}) {
    return <Popover.Root>
        <Popover.Trigger asChild>
            <Button label='Mi cuenta' iconName='account_circle' className={clsx(className)} variant='tertiary'/>
        </Popover.Trigger>

        <Popover.Portal>
            <Popover.Content className='bg-stone-700 border-stone-600 drop-shadow border p-4 rounded text-stone-300'>
                    {children}
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
}

