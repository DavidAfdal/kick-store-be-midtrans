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
    code: 200,
    status: 'Succes',
    message: message,
  };
  return response;
};

const StatusNotFound = (message, error) => {
  const response = {
    code: 404,
    status: 'Not Found',
    message: message,
    error,
  };
  return response;
};

const StatusIntervalServerError = (error, message = 'Something went wrong in server') => {
  const response = {
    code: 500,
    status: 'Interval Server Error',
    message: message,
    error,
  };
  return response;
};

const StatusCostumRespon = (message, code = 500, status = 'Interval Server Error', error = '') => {
  let response;
  if (error !== '') {
    response = {
      code: code,
      status: status,
      message,
      error,
    };
  } else {
    response = {
      code: code,
      status: status,
      message,
    };
  }
  return response;
};

export default {
  StatusGetData,
  StatusCreated,
  StatusNoContent,
  StatusNotFound,
  StatusIntervalServerError,
  StatusCostumRespon,
};
