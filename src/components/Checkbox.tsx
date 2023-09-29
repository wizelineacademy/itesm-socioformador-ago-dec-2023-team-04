import * as BaseCheckbox from '@radix-ui/react-checkbox';
import Icon from '@/components/Icon';
import clsx from 'clsx';

export default function Checkbox({className}: {className?: string}) {
    return <BaseCheckbox.Root className={clsx('w-6 h-6 rounded border-stone-700 border', className)}>
        <BaseCheckbox.Indicator asChild>
            <Icon name='check' className='text-sm w-2 h-2'/>
        </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
}
