<template>
	<div class="form">
		<AccountItem
			v-for="accountItem of accountStore?.accountList"
			:key="accountItem.id"
			:accountItem="accountItem"
		/>
	</div>
</template>

<script setup lang="ts">
import AccountItem from "./AccountItem.vue";

import { useAccountStore } from "@/stores/useAccountStore";

const accountStore = useAccountStore();
</script>

<style scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
</style>
