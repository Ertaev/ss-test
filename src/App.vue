<template>
	<Header />

	<InfoBanner />

	<div class="container">
		<Head />

		<AccountList v-if="accountStore?.accountList?.length > 0" />

		<EmptyBlock v-else />
	</div>
</template>

<script setup lang="ts">
import Header from "@/components/Header.vue";
import InfoBanner from "@/components/InfoBanner.vue";
import Head from "@/components/Account/Head.vue";
import AccountList from "@/components/Account/AccountList.vue";
import EmptyBlock from "@/components/Account/EmptyBlock.vue";

import { useAccountStore } from "@/stores/useAccountStore";

const accountStore = useAccountStore();
</script>
