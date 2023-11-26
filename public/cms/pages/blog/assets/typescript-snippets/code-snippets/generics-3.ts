type CustomOmit<G_Type extends Record<string, any>, G_KeysToOmit extends keyof G_Type> = {
	[Key in keyof G_Type as Key extends G_KeysToOmit ? never : Key]: G_Type[Key];
};

type CustomPick<G_Type extends Record<string, any>, G_KeysToOmit extends keyof G_Type> = {
	[Key in G_KeysToOmit]: G_Type[Key];
};
