<template>
	<el-form class="item" ref="accountFormRef" :model="accountForm" :rules="accountFormRules">
		<el-form-item prop="tags">
			<el-input 
				v-model="accountForm.tags" 
				maxlength="50" 
				placeholder="Значение" 
				@blur="checkForm"
				clearable 
			/>
		</el-form-item>

		<el-form-item>
			<el-select v-model="accountForm.type" @change="handleTypeChange">
				<el-option label="Локальная" :value="AccountTypes.LOCAL" />
				<el-option label="LDAP" :value="AccountTypes.LDAP" />
			</el-select>
		</el-form-item>

		<el-form-item prop="login">
			<el-input 
				v-model="accountForm.login" 
				maxlength="100" 
				placeholder="Значение" 
				@blur="checkForm"
				clearable 
			/>
		</el-form-item>

		<el-form-item v-if="accountForm.type === AccountTypes.LOCAL" prop="password">
			<el-input 
				v-model="accountForm.password" 
				maxlength="100" 
				placeholder="Значение" 
				@blur="checkForm"
				show-password 
			/>
		</el-form-item>

		<el-button type="danger" :icon="Delete" @click="accountStore.removeAccountItem(accountItem.id)" />
	</el-form>
</template>

<script setup lang="ts">
import { reactive, useTemplateRef } from "vue";

import { AccountTypes } from "@/types/Account";
import type { Account } from "@/types/Account";
import type { FormInstance, FormRules } from "element-plus";

import { Delete } from "@element-plus/icons-vue";
import { useAccountStore } from "@/stores/useAccountStore";

const accountStore = useAccountStore();
const props = defineProps<{ accountItem: Account }>();
const accountForm = reactive<Account>({ ...props.accountItem });
const accountFormRef = useTemplateRef<FormInstance>("accountFormRef");
const accountFormRules = reactive<FormRules<Account>>({
	tags: [{ trigger: "blur", validator: validateField }],
	login: [{ required: true, trigger: "blur", validator: validateField }],
	password: [{ trigger: "blur", validator: validateField }],
});

function validateField(rule: any, value: string | null, callback: any) {
	const field = rule.field;

	if (field === "tags") {
		if (value && value.length > 50) {
			callback(new Error());
		} else {
			callback();
		}
	}

	if (field === "login") {
		if (value?.length === 0 || value && value?.length > 100) {
			callback(new Error());
		} else {
			callback();
			accountForm.login = accountForm.login.trim();
		}
	}

	if (field === "password") {
		if (accountForm.type === AccountTypes.LOCAL) {
			if (value?.length === 0 || value && value?.length > 100) {
				callback(new Error());
			} else {
				callback();
				accountForm.password = accountForm.password && accountForm.password.trim();
			}
		} else {
			callback();
			accountForm.password = accountForm.password && accountForm.password.trim();
		}
	}
};

function handleTypeChange(value: string) {
	accountForm.password = value === AccountTypes.LOCAL ? "" : null;
	checkForm();
};

function checkForm() {
	const formEl = accountFormRef.value;
	if (!formEl) return;

	formEl.validate((valid) => {
		if (valid) {
			accountStore.updateAccountItem(accountForm);
		}
	});
};
</script>

<style scoped>
.el-form {
	display: flex;
}

.el-form-item {
	width: 100%;
	margin-bottom: 0;
	min-width: 250px;
}

.el-form-item:nth-child(1),
.el-form-item:nth-child(2) {
	max-width: 250px;
}

.item {
	display: flex;
	align-items: center;
	gap: 30px;
}
</style>
