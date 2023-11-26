const StatusGetData = (message, data) => {
  const response = {
    code: 200,
    status: 'Ok',
    message: message,
    data: data,
  };
  return response;
};

const StatusCreated = (message) => {
  const response = {
    code: 201,
    status: 'Created',
    message: message,
  };
  return response;
};

const StatusNoContent = (message) => {
  const response = {
    code: 204,
    status: 'No Content',
    message: message,
  };
  return response;
};

const StatusNotFound = (errMessage, error) => {
  const response = {
    code: 404,
    status: 'Not Found',
    message: errMessage,
    error,
  };
  return response;
};

export default {
  StatusGetData,
  StatusCreated,
  StatusNoContent,
  StatusNotFound,
};
