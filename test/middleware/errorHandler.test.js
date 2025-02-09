import { describe, it, expect, vi } from "vitest";
import errorHandler from "../../src/middleware/errorHandler";
import Joi from "joi";

describe("errorHandler middleware", () => {
  const mockReq = {};
  const mockNext = vi.fn();
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  it("should handle multiple Joi validation errors", () => {
    const joiError = new Joi.ValidationError("Validation error", [
      {
        message: "Invalid email,INVALID_EMAIL",
        context: { label: "email" },
      },
      {
        message: "Password is too short,STRING_MIN",
        context: { label: "password" },
      },
    ]);

    errorHandler(joiError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid request data. Please review the request and try again.",
      errors: [
        { message: "Invalid email", field: "email", code: "INVALID_EMAIL" },
        { message: "Password is too short", field: "password", code: "STRING_MIN" },
      ],
    });
  });

  it("should handle Joi required field validation error", () => {
    const joiError = new Joi.ValidationError("Validation error", [
      {
        message: '"username" is required,MISSING',
        context: { label: "username" },
      },
    ]);

    errorHandler(joiError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid request data. Please review the request and try again.",
      errors: [
        { message: '"username" is required', field: "username", code: "MISSING" },
      ],
    });
  });

  it("should handle Joi validation errors with missing or unknown code", () => {
    const joiError = new Joi.ValidationError("Validation error", [
      {
        message: "Invalid email format",
        context: { label: "email" },
      },
      {
        message: "Age must be a number",
        context: { label: "age" }, 
      },
    ]);
  
    errorHandler(joiError, mockReq, mockRes, mockNext);
  
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid request data. Please review the request and try again.",
      errors: [
        { message: "Invalid email format", field: "email", code: "UNKNOWN_CODE" },
        { message: "Age must be a number", field: "age", code: "UNKNOWN_CODE" },
      ],
    });
  });
  

  it("should handle Joi min and max validation errors", () => {
    const joiError = new Joi.ValidationError("Validation error", [
      {
        message: '"age" must be greater than 18,NUMBER_MIN',
        context: { label: "age" },
      },
      {
        message: '"name" length must be at least 3 characters long,STRING_MIN',
        context: { label: "name" },
      },
    ]);

    errorHandler(joiError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid request data. Please review the request and try again.",
      errors: [
        { message: '"age" must be greater than 18', field: "age", code: "NUMBER_MIN" },
        { message: '"name" length must be at least 3 characters long', field: "name", code: "STRING_MIN" },
      ],
    });
  });

  it("should handle generic errors with custom status", () => {
    const error = new Error("Not Found");
    error.status = 404;

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Not Found",
    });
  });

  it("should handle internal server errors", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Some internal error");

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Internal server error. Please try again later.",
    });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
