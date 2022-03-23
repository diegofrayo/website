import * as React from "react";

import { Input, Block, Button, Icon, Link } from "~/components/primitive";
import http from "~/lib/http";
import type { T_ReactElement } from "~/types";

function ISR(): T_ReactElement {
  const {
    // states
    path,

    // handlers
    handleUpdateClick,
    onChange,
  } = useController();

  return (
    <Block>
      <Input
        id="input-path"
        label="Path"
        value={path}
        onChange={onChange}
      />
      <Block className="tw-flex tw-justify-between">
        <Link
          variant={Link.variant.UNSTYLED}
          href={path}
          isExternalUrl
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

function useController() {
  const [path, setPath] = React.useState("/personal/contacts");

  function onChange(e) {
    setPath(e.target.value);
  }

  async function handleUpdateClick() {
    try {
      await http.post("/api/diegofrayo", { path, secret: process.env.NEXT_PUBLIC_ISR_TOKEN });
      alert("Completed");
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  }

  return {
    // states
    path,

    // handlers
    onChange,
    handleUpdateClick,
  };
}
