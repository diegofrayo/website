import { AuthService } from "~/auth";
import type { T_ReactFunctionComponent } from "~/types";

import renderIf from "./renderIf";

function withRequiredAuthComponent<P>(WrappedComponent: T_ReactFunctionComponent<P>): any {
  return renderIf(WrappedComponent)(() => AuthService.isUserLoggedIn());
}

export default withRequiredAuthComponent;
