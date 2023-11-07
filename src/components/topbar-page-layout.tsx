'use client';
import React, {type ReactNode, useRef} from 'react';
import Link from 'next/link';
import TopBar from '@/components/top-bar.tsx';
import Spacer from '@/components/spacer.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TextField from '@/components/text-field.tsx';
import Table from '@/components/table.tsx';

export type TopbarPageLayoutProps = {
	readonly topbarItems?: ReactNode;
	readonly children: ReactNode;
	readonly title: string;
};

export default function TopbarPageLayout(props: TopbarPageLayoutProps) {
	const {topbarItems, children, title} = props;

	const scrollRef = useRef<HTMLDivElement>(null);
	const boundingRef = useRef<HTMLDivElement>(null);

	return (
		<main className='text-stone-400 h-screen flex flex-col'>
			<TopBar boundingRef={boundingRef} scrollRef={scrollRef} title={title}>
				{topbarItems}
			</TopBar>
			<div ref={boundingRef} className='grow overflow-scroll'>
				<div ref={scrollRef} className='p-4 max-w-6xl mx-auto'>
					{children}
				</div>
			</div>
		</main>
	);
}
