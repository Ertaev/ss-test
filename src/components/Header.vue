<template>
	<div class="container">
		<el-row align="middle" class="header">
			<h1>Учетные записи</h1>

			<el-button @click="accountStore.addAccountItem">+</el-button>
		</el-row>
	</div>
</template>

<script setup>
import { useAccountStore } from "@/stores/useAccountStore";

const accountStore = useAccountStore();
</script>

<style scoped>
.header {
	gap: 12px;
}
</style>
