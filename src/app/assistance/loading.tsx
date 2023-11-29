import React from 'react';

export default function Loading() {
	return (
		<div className='h-screen gap-2 flex flex-col p-4 animate-pulse'>
			<div className='animate-pulse grow overflow-hidden relative rounded [--submitted-color:theme(colors.stone.100)] '/>
		</div>
	);
}
