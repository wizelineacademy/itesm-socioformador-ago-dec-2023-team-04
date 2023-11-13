export type ServerActionSuccess = {
	success: true;
};

export type ServerActionSuccessWithData<Data> = {
	success: true;
	data: Data;
};

export type ServerActionFailure = {
	success: false;
	name?: string;
	message: string;
};

export type ServerActionResult<Data=undefined> = (Data extends undefined ? ServerActionSuccess : ServerActionSuccessWithData<Data>) | ServerActionFailure;

export const internalErrorResult = {
	success: false as const,
	name: 'Internal Server Error',
	message: 'An unknown error has occurred.',
};
