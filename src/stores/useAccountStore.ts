import { defineStore } from "pinia";
import { ref } from "vue";
import type { Account } from "@/types/Account";
import { AccountTypes } from "@/types/Account";

const STORAGE_KEY = "accounts";

const readAllAccounts = (): Account[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const parsed: unknown = JSON.parse(stored);
		if (!Array.isArray(parsed)) return [];

		return parsed.map((item: any): Account => ({
			...item,
			tags: Array.isArray(item.tags)
				? item.tags.map((tag: any) => tag.text?.trim()).join(";")
				: item.tags ?? "",
			password: item.password ?? null,
		}));
	} catch (e) {
		console.warn("Не удалось распарсить данные из localStorage:", e);
		return [];
	}
};

const saveToLocalStorage = (item: Account) => {
	if (!item) return;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		let parsed: Account[] = stored ? JSON.parse(stored) : [];

		parsed = parsed.filter((acc): acc is Account => acc !== null && acc !== undefined);

		const existingIndex = parsed.findIndex(acc => acc.id === item.id);

		if (existingIndex !== -1) {
			parsed[existingIndex] = item;
		} else {
			parsed.push(item);
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
	} catch (e) {
		console.error("Ошибка при сохранении аккаунта:", e);
	}
};

const removeAccountFromStorage = (id: number) => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;

		const parsed: unknown = JSON.parse(stored);
		if (!Array.isArray(parsed)) return;

		const updated = parsed.filter((item: any) => item?.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	} catch (e) {
		console.error("Ошибка при удалении аккаунта:", e);
	}
};

export const useAccountStore = defineStore("accountStore", () => {
	const accountList = ref<Account[]>(readAllAccounts());

	const addAccountItem = () => {
		accountList.value.push({
			id: Date.now() + Math.floor(Math.random() * 100000),
			tags: "",
			type: AccountTypes.LOCAL,
			login: "",
			password: "",
		});
	};

	const removeAccountItem = (id: number) => {
		accountList.value = accountList.value.filter(item => item.id !== id);
		removeAccountFromStorage(id);
	};

	const updateAccountItem = (updated: Account): boolean => {
		if (!updated.login) return false;

		if (updated.type !== AccountTypes.LDAP && !updated.password?.toString()) return false;

		const tagsArray = typeof updated.tags === "string"
			? updated.tags
				.split(";")
				.map(tag => tag.trim())
				.filter(tag => tag.length > 0)
				.map(tag => ({ text: tag }))
			: updated.tags;

		const index = accountList.value.findIndex(item => item.id === updated.id);

		if (index !== -1) {
			accountList.value[index] = {
				...updated,
				login: updated.login.trim(),
				tags: tagsArray,
				password: updated.password ?? null,
			};

			saveToLocalStorage(accountList.value[index]);
			return true;
		} else {
			return false;
		}
	};

	return {
		accountList,
		addAccountItem,
		removeAccountItem,
		updateAccountItem,
	};
});
