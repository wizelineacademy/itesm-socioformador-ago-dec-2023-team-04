type ServerActionSuccess<Data=never> = {
	success: true;
	data: Data;
};

type ServerActionFailure = {
	success: false;
	name?: string;
	message: string;
};

export type ServerActionResult<Data=never> = ServerActionSuccess<Data> | ServerActionFailure;
