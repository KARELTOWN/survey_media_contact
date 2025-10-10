<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="space-y-5 sm:space-y-6">
            <ComponentCard>
                <PermissionList />
            </ComponentCard>
        </div>
    </AdminLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PermissionList from "@/components/role/PermissionList.vue";
const currentPageTitle = ref("Permissions");
</script>
