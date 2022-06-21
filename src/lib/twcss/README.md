# twcss

## Description

Library with `styled-components` flavored syntax for creating components easily using `tailwind` classes or your own classes

## Examples

- Basic
  ```
  // definition
  const LineContent = twcss.span("tw-table-cell your-own-class");
  const LineContent = twcss.span`tw-table-cell your-own-class`;
  const LineContent = twcss.span``;

  // usage
  <LineContent id="id" className="add-more-classes">hello</LineContent>
  ```

- With a map of styles variants
  ```
  // definition
  const MyElement = twcss.p({
    $TWCSS_BASE_STYLES: "tw-text-lg",
    UNSTYLED: "",
    PRIMARY:
      "tw-text-black",
    SECONDARY: (props) => `tw-text-white ${props.active ? "tw-font-bold" : ""}`,
  });

  // usage
  <MyElement>
    {children}
  </MyElement>
  <MyElemen TWCSSVariant="SECONDARY" active>
    {children}
  </MyElemen>
  ```

- Passing a custom component as main tag and setting a staticProps object
  ```
  // definition
  const YourOwnButton = (props) => <button {...props}>
  const MyTWCSSButton = twcss(YourOwnButton)(
    "tw-font-bold",
    {
      role: "submit",
    },
  );

  // usage
  <MyTWCSSButton className="tw-text-gray-500">

  // output
  <button role="submit" class="tw-font-bold tw-text-gray-500" />
  ```



