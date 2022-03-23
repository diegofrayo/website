import classNames from "classnames";
import * as React from "react";

import { Block, Button, Icon, InlineText } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

function GoBack({ className }: { className: string }): T_ReactElement {
  return (
    <Block
      className={classNames(
        "tw-left-0 tw-right-0 tw-h-8 tw-p-1 tw-text-sm tw-font-bold dfr-bg-color-dark-strong dfr-text-color-light-strong",
        className,
      )}
    >
      <Button
        variant={Button.variant.SIMPLE}
        onClick={() => {
          if (window.confirm("¿Are you sure?")) {
            window.history.back();
          }
        }}
      >
        <Icon
          icon={Icon.icon.CHEVRON_LEFT}
          color="tw-text-white"
        />
        <InlineText className="tw-align-middle tw-font-bold"> Go back</InlineText>
      </Button>
    </Block>
  );
}

export default GoBack;
