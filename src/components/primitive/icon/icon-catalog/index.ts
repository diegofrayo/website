import { mirror } from "@diegofrayo-pkg/utilities/arrays-and-objects";

import ImagesAsIcons from "./images-as-icons";
import * as LibraryIcons from "./library-icons";
import InlineIcons from "./svg-icons";

export const Icons = { ...InlineIcons, ...ImagesAsIcons, ...LibraryIcons };

export type IconName = keyof typeof Icons;

export const IconCatalog = mirror(Object.keys(Icons)) satisfies Record<IconName, IconName>;
