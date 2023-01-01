import v from "~/lib/validator";

abstract class AppError extends Error {
	constructor(
		public id: string,
		public description: string,
		public statusCode: number | null,
		public cause?: unknown,
	) {
		super(description);
		this.cause = v.isObject(cause)
			? {
					message: cause["message"],
					...cause,
			  }
			: cause;
	}
}

export default AppError;
