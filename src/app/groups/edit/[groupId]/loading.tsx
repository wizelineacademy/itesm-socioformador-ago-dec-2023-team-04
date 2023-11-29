import React from 'react';

function Loading() {
	return (
		<div className='flex gap-4'>
			<div className='animate-pulse bg-stone-800 grow rounded'>
				<table className='w-full h-full table-auto'/>
				<th className='text-left font-semibold text-sm hover:cursor-pointer px-4 py-3'>
					<div className='flex gap-2 items-center'/>
				</th>
				<th className='text-left font-semibold text-sm hover:cursor-pointer px-4 py-3'>
					<div className='flex gap-2 items-center'/>
				</th>
				<th className='text-left font-semibold text-sm hover:cursor-pointer px-4 py-3'>
					<div className='flex gap-2 items-center'/>
				</th>
			</div>
		</div>
	);
}

export default Loading;
