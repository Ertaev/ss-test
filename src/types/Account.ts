export type AccountType = "Локальная" | "LDAP";
export enum AccountTypes {
	LOCAL = "Локальная",
	LDAP = "LDAP",
}

export interface Account {
	id: number;
	tags?: { text: string }[] | string;
	type: AccountTypes;
	login: string;
	password: string | null;
}
