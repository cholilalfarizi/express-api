import Customer from "../model/CustomerModel.js";
import { responseMessage } from "../utils/responseMessage.js";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
export const getCustomer = async (req, res) => {
  try {
    const response = await Customer.findAll({
      where: {
        is_deleted: false
      }
    });
    if (response.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(responseMessage(StatusCodes.NOT_FOUND, "No Customers Found", getReasonPhrase(StatusCodes.NOT_FOUND)));
    }
    res.status(StatusCodes.OK).json(responseMessage(StatusCodes.OK, "Get Customer Successfully", getReasonPhrase(StatusCodes.OK), response));
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessage(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
  }
};
export const getCustomerById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const response = await Customer.findOne({
      where: {
        customer_id: id
      }
    });
    if (!response) {
      return res.status(StatusCodes.NOT_FOUND).json(responseMessage(StatusCodes.NOT_FOUND, `Customer with ID ${id} Not Found`, getReasonPhrase(StatusCodes.NOT_FOUND)));
    }
    res.status(StatusCodes.OK).json(responseMessage(StatusCodes.OK, "Get Customer Successfully", getReasonPhrase(StatusCodes.OK), response));
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessage(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
  }
};
export const createCustomer = async (req, res) => {
  try {
    await Customer.create({
      ...req.body,
      is_deleted: false
    });
    res.status(StatusCodes.CREATED).json(responseMessage(StatusCodes.CREATED, "Customer Created Successfully", getReasonPhrase(StatusCodes.CREATED)));
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessage(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
  }
};
export const updateCustomer = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const [updatedRowCount] = await Customer.update(req.body, {
      where: {
        customer_id: id
      }
    });
    if (updatedRowCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(responseMessage(StatusCodes.NOT_FOUND, `Customer with ID ${id} Not Found`, getReasonPhrase(StatusCodes.NOT_FOUND)));
    }
    res.status(StatusCodes.OK).json(responseMessage(StatusCodes.OK, "Customer Updated Successfully", getReasonPhrase(StatusCodes.OK)));
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessage(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
  }
};
export const deleteCustomer = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const [updatedRowCount] = await Customer.update({
      is_deleted: true
    }, {
      where: {
        customer_id: id
      }
    });
    if (updatedRowCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json(responseMessage(StatusCodes.NOT_FOUND, `Customer with ID ${id} Not Found`, getReasonPhrase(StatusCodes.NOT_FOUND)));
    }
    res.status(StatusCodes.OK).json(responseMessage(StatusCodes.OK, "Customer Deleted Successfully", getReasonPhrase(StatusCodes.OK)));
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseMessage(StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)));
  }
};