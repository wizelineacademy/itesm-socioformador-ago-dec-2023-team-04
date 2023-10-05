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
