export const responseMessage = (statusCode, message, status, data = null) => {
  return {
    statusCode: statusCode,
    message: message,
    status: status,
    data: data,
  };
};
