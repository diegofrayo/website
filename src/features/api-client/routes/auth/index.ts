import checkSession from "./endpoints/check-session";
import signIn from "./endpoints/sign-in";
import signOut from "./endpoints/sign-out";

const authRouter = {
	checkSession,
	signIn,
	signOut,
};

export default authRouter;

export * from "./endpoints/check-session";
export * from "./endpoints/sign-in";
export * from "./endpoints/sign-out";
