import * as React from "react";

import { Input, Block, Button, Icon, Link } from "~/components/primitive";
import http from "~/lib/http";
import { getErrorMessage, reportError } from "~/utils/app";
import { showAlert } from "~/utils/browser";
import { ENV_VARS } from "~/utils/constants";
import type {
  T_ReactElement,
  T_ReactOnChangeEventHandler,
  T_ReactOnClickEventHandler,
} from "~/types";

function ISR(): T_ReactElement {
  const {
    // states & refs
    path,

    // handlers
    handleUpdateClick,
    onChangeHandler,
  } = useController();

  return (
    <Block>
      <Input
        id="input-path"
        label="Path"
        value={path}
        onChange={onChangeHandler}
      />
      <Block className="tw-flex tw-justify-between">
        <Link
          variant={Link.variant.UNSTYLED}
          href={path}
          isExternalLink
        >
          <Icon icon={Icon.icon.EXTERNAL_LINK} />
        </Link>
        <Button
          variant={Button.variant.DEFAULT}
          onClick={handleUpdateClick}
        >
          update
        </Button>
      </Block>
    </Block>
  );
}

export default ISR;

// --- Controller ---

type T_UseControllerReturn = {
  path: string;
  onChangeHandler: T_ReactOnChangeEventHandler<HTMLInputElement>;
  handleUpdateClick: T_ReactOnClickEventHandler<HTMLButtonElement>;
};

function useController(): T_UseControllerReturn {
  // states & refs
  const [path, setPath] = React.useState("/resume");

  // handlers
  const onChangeHandler: T_UseControllerReturn["onChangeHandler"] = function onChangeHandler(
    event,
  ) {
    setPath(event.target.value);
  };

  const handleUpdateClick: T_UseControllerReturn["handleUpdateClick"] =
    async function handleUpdateClick() {
      try {
        await http.post("/api/diegofrayo", { path, secret: ENV_VARS.NEXT_PUBLIC_ISR_TOKEN });
        showAlert("Success");
      } catch (error) {
        reportError(error);
        showAlert(getErrorMessage(error));
      }
    };

  return {
    // states & refs
    path,

    // handlers
    onChangeHandler,
    handleUpdateClick,
  };
}
