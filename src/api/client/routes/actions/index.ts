import checkSession from "./endpoints/check-session";
import isr from "./endpoints/isr";
import signIn from "./endpoints/sign-in";
import signOut from "./endpoints/sign-out";

const actionsRouter = {
	checkSession,
	isr,
	signIn,
	signOut,
};

export default actionsRouter;

export * from "./endpoints/check-session";
export * from "./endpoints/isr";
export * from "./endpoints/sign-in";
export * from "./endpoints/sign-out";
