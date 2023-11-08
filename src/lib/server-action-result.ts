type ServerActionSuccess = {
	success: true;
};

type ServerActionSuccessWithData<Data> = {
	success: true;
	data: Data;
};

type ServerActionFailure = {
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
