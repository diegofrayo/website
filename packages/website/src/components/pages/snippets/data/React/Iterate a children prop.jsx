<ul>
  {React.Children.map(children, (child) => {
    if (child.props.myProp === "x") {
      return (
        <li>
          <span className="tw-font-bold tw-mr-1">☑</span>
          <span className="tw-line-through tw-italic tw-opacity-75">{child.props.children}</span>
        </li>
      );
    }

    return child;
  })}
</ul>