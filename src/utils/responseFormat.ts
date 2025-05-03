interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
}

export const resSuccess = <T>(data: T, message = 'Success', statusCode = 200): ApiResponse<T> => ({
  statusCode,
  message,
  data
});

export const resError = (message = 'Internal server error', statusCode = 500): ApiResponse<null> => ({
  statusCode,
  message
});
