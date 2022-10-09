export interface BasicResponse {
  statusCode: number;
  response: string;
}

export interface IsSuccessResponse {
  isSuccess: boolean | number;
  message: string;
}

export interface IsCreateSuccessResponse {
  hasNew: boolean;
  isSuccess: boolean | number;
  message: string;
}
