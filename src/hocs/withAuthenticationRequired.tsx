import { AuthService } from "~/auth";
import type { T_ReactFunctionComponent } from "~/types";

import renderIf from "./renderIf";

function withAuthenticationRequired<G_ComponentProps>(
  WrappedComponent: T_ReactFunctionComponent<G_ComponentProps>,
): T_ReactFunctionComponent<G_ComponentProps> {
  return renderIf(WrappedComponent)(() => AuthService.isUserLoggedIn());
}

export default withAuthenticationRequired;
