import * as React from "react";

type T_UseTabsReturn = {
	selectTab: (newTabIndex: number) => void;
	selectedTabIndex: number;
};

function useTabs(): T_UseTabsReturn {
	// states & refs
	const [tabIndex, setTabIndex] = React.useState(0);

	// handlers
	const selectTab: T_UseTabsReturn["selectTab"] = function selectTab(newTabIndex) {
		setTabIndex(newTabIndex);
	};

	return {
		selectTab,
		selectedTabIndex: tabIndex,
	};
}

export default useTabs;