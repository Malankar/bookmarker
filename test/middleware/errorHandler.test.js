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

  it("should handle Joi validation errors", () => {
    const joiError = new Joi.ValidationError("Validation error", [
      {
        message: "Invalid email,INVALID_EMAIL",
        context: { label: "email" },
      },
    ]);

    errorHandler(joiError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid request data. Please review the request and try again.",
      errors: [
        {
          message: "Invalid email",
          field: "email",
          code: "INVALID_EMAIL",
        },
      ],
    });
  });

  it("should handle Joi validation errors with unknown code", () => {
    const joiError = new Joi.ValidationError("Validation error", [
      {
        message: "Invalid email",
        context: { label: "email" },
      },
    ]);

    errorHandler(joiError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid request data. Please review the request and try again.",
      errors: [
        {
          message: "Invalid email",
          field: "email",
          code: "UNKNOWN_CODE",
        },
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
