import React, {type ReactNode} from 'react';
import TopBar from '@/components/top-bar.tsx';

export type TopBarPageLayoutProps = {
	readonly topBarItems?: ReactNode;
	readonly children: ReactNode;
	readonly title: ReactNode;
	readonly subtitle?: ReactNode;
};

export default function TopBarPageTemplate(props: TopBarPageLayoutProps) {
	const {topBarItems, children, title, subtitle} = props;

	return (
		<main className='text-stone-400'>
			<TopBar title={title} subtitle={subtitle}>
				{topBarItems}
			</TopBar>
			<div>
				<div className='p-4 max-w-6xl mx-auto'>
					{children}
				</div>
			</div>
		</main>
	);
}
