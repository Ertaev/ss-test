import { defineStore } from "pinia";
import { ref } from "vue";
import type { Account } from "@/types/Account";
import { AccountTypes } from "@/types/Account";

const STORAGE_KEY = "accounts";

export const useAccountStore = defineStore("accountStore", () => {
	const stored = localStorage.getItem(STORAGE_KEY);
	const parsed: Account[] = stored ? JSON.parse(stored) : [];

	const normalized: Account[] = parsed.map(item => ({
		...item,
		tags: Array.isArray(item.tags)
			? item.tags.map(tag => tag.text.trim()).join(";")
			: item.tags ?? "",
		password: item.password ?? "",
	}));

	const accountList = ref<Account[]>(normalized);

	const addAccountItem = () => {
		accountList.value.push({
			id: Date.now(),
			tags: "",
			type: AccountTypes.LOCAL,
			login: "",
			password: "",
		});
	};

	const removeAccountItem = (id: number) => {
		accountList.value = accountList.value.filter(item => item.id !== id);

		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(
				accountList.value.map(item => ({
					...item,
					tags: typeof item.tags === "string"
						? item.tags
							.split(";")
							.map(tag => tag.trim())
							.filter(tag => tag.length > 0)
							.map(tag => ({ text: tag }))
						: item.tags,
					password: item.password ?? "",
				}))
			)
		);
	};

	const updateAccountItem = (updated: Account): boolean => {
		if (!updated.login) return false;

		if (updated.type !== AccountTypes.LDAP) {
			if (!updated.password?.toString()) return false;
		}

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
				password: updated.password ?? "",
			};

			saveToLocalStorage(index, accountList.value[index]);
			return true;
		}

		return false;
	};

	const saveToLocalStorage = (index: number, item: Account) => {
		if (!item) return;

		const stored = localStorage.getItem(STORAGE_KEY);
		let parsed: Account[] = stored ? JSON.parse(stored) : [];

		parsed = parsed.filter((acc): acc is Account => acc !== null && acc !== undefined);

		if (index >= 0 && index < parsed.length) {
			parsed[index] = item;
		} else {
			parsed.push(item);
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
	};

	return {
		accountList,
		addAccountItem,
		removeAccountItem,
		updateAccountItem,
	};
});
