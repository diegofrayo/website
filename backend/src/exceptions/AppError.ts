class AppError extends Error {
	static HttpCodes = {
		OK: 200,
		NO_CONTENT: 204,
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500,
	};
	message: string;
	statusCode: number;
	type: string;
	id: string;
	cause?: string;

	constructor(message: string, statusCode: number, type: string, id: string, cause?: string) {
		super(message);
		this.id = id;
		this.statusCode = statusCode;
		this.message = message;
		this.type = type;
		this.cause = cause || "";
	}
}

export default AppError;

/*
statusCode: number;
message: string;
id: string;
type: string;

constructor(message: string) {
	super(message);
	this.id = "SVR1";
	this.statusCode = 500;
	this.message = message;
	this.type = "SERVER_ERROR";
}

export enum HttpCode { }

interface AppErrorArgs {
  name?: string;
  httpCode: HttpCode;
  description: string;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}

class CharacterCountExceeded extends Error { // parent error
  constructor(post_id, content) {
      super();
      this.name = this.constructor.name // good practice

      if (this instanceof LongTitleError) // checking if title or body
          this.type = 'title'
      else if (this instanceof LongBodyError)
          this.type = 'body'

    this.message = `The character count of post (id: ${post_id}) ${this.type} is too long. (${content.length} characters)` // detailed error message
    this.statusCode = 500 // error code for responding to client
  }
}

// extending to child error classes
class LongTitleError extends CharacterCountExceeded { }
class LongBodyError extends CharacterCountExceeded { }

module.exports = {
    CharacterCountExceeded,
    LongTitleError,
    LongBodyError
}
*/
