import * as BaseCheckbox from '@radix-ui/react-checkbox';

export default function Checkbox() {
    return <BaseCheckbox.Root>
        <BaseCheckbox.Indicator>
            <span className='material-symbols-rounded'>check</span>
        </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
}
