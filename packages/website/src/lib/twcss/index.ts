import HTML_TAGS from "./tags";
import twcssCreator from "./service";

// TODO: Type this var
const twcss: any = Object.assign(
  twcssCreator,
  HTML_TAGS.reduce((result, tagName: string) => {
    result[tagName] = twcssCreator(tagName);
    return result;
  }, {}),
);

export default twcss;
