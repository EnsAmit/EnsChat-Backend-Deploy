import moment from 'moment';

const createError = (status, message)=>{
    const error = new Error();
    error.status = status;
    error.message = message;
    return error;
}

const convertToIST = (dateTime, format) => {
    try {
      return moment
        .utc(dateTime)
        .local()
        .format(format ? format.toString() : 'YYYY-MM-DDTHH:mm:ss.sssZ');
    } catch (error) {
      return dateTime;
    }
  }
  

export {
    createError,
    convertToIST
  };
  