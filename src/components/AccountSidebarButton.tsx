'use client';
import React, {ComponentProps} from "react";
import clsx from 'clsx';
import * as Popover from '@radix-ui/react-popover'
import {Button} from '@/components/Button';
import Icon from '@/components/Icon';

export default function AccountSidebarButton({
                                                 children,
                                                 className,
                                             }: {
    children: React.ReactNode,
    className: string
}) {
    return <Popover.Root>
        <Popover.Trigger asChild>
            <Button className={clsx(className)} variant='tertiary'>
                <Icon name='account_circle' className='me-2'/>
                Mi cuenta
            </Button>
        </Popover.Trigger>

        <Popover.Portal>
            <Popover.Content className='bg-stone-700 border-stone-600 drop-shadow border p-4 rounded text-stone-300'>
                {children}
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
}

