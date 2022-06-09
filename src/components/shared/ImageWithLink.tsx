import * as React from "react";

import { Image, Link } from "~/components/primitive";
import type { T_HTMLElementAttributes, T_ReactElement } from "~/types";

type T_ImageWithLink = T_HTMLElementAttributes["img"];

function ImageWithLink({ src, className, alt, ...rest }: T_ImageWithLink): T_ReactElement {
  return (
    <Link
      variant={Link.variant.SIMPLE}
      href={src}
      className="tw-block"
      isExternalUrl
    >
      <Image
        src={src}
        alt={alt}
        className={className}
        {...rest}
      />
    </Link>
  );
}

export default ImageWithLink;
