import classNames from "classnames";
import * as React from "react";

import { Block, Button, Icon, InlineText } from "~/components/primitive";
import { goBack } from "~/utils/routing";
import type { T_ReactElement } from "~/types";

type T_GoBackProps = { className: string };

function GoBack({ className }: T_GoBackProps): T_ReactElement {
  // handlers
  function handleGoBackClick(): void {
    if (window.confirm("¿Are you sure?")) {
      goBack();
    }
  }

  // render
  return (
    <Block
      className={classNames(
        "tw-left-0 tw-right-0 tw-h-8 tw-p-1 tw-text-sm tw-font-bold dfr-bg-color-dark-strong dfr-text-color-light-strong",
        className,
      )}
    >
      <Button
        variant={Button.variant.SIMPLE}
        onClick={handleGoBackClick}
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
