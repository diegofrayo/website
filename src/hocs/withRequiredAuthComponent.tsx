import { AuthService } from "~/auth";
import type { T_ReactFunctionComponent } from "~/types";

import renderIf from "./renderIf";

function withRequiredAuthComponent<Props>(
  WrappedComponent: T_ReactFunctionComponent<Props>,
): T_ReactFunctionComponent<Props> {
  return renderIf(WrappedComponent)(() => AuthService.isUserLoggedIn());
}

export default withRequiredAuthComponent;
