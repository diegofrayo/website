import * as React from "react";

import { Image, Link } from "~/components/primitive";
import type { T_ReactElement } from "~/types";

function ImageWithLink({
  src,
  className,
  alt,
  ...rest
}: {
  src: string;
  className?: string;
  alt?: string;
}): T_ReactElement {
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
