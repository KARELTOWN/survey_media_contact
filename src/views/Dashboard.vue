<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <global-statistics />

      </div>
      <div class="col-span-12 xl:col-span-5">

      </div>

      <div class="col-span-12">

      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import GlobalStatistics from '../components/graphic/GlobalStatistics.vue'
export default {
  components: {
    AdminLayout,
    GlobalStatistics,
  
  },
  name: 'Dashboard',
}
</script>
