<template>
  <admin-layout>
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <!-- <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
        <monthly-target />
      </div> -->
      <div class="col-span-12 xl:col-span-5">
        <!-- <monthly-sale /> -->
      </div>

      <div class="col-span-12">
        <!-- <statistics-chart /> -->
      </div>

      <!-- <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div> -->

      <div class="col-span-12 xl:col-span-7">
        <!-- <recent-orders /> -->
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/graphic/EcommerceMetrics.vue'
import MonthlyTarget from '../components/graphic/MonthlySale.vue'
import MonthlySale from '../components/graphic/MonthlyTarget.vue'
import CustomerDemographic from '../components/graphic/CustomerDemographic.vue'
import StatisticsChart from '../components/graphic/StatisticsChart.vue'
import RecentOrders from '../components/graphic/RecentOrders.vue'
export default {
  components: {
    AdminLayout,
    // EcommerceMetrics,
    // MonthlyTarget,
    // MonthlySale,
    // CustomerDemographic,
    // StatisticsChart,
    // RecentOrders,
  },
  name: 'Dashboard',
}
</script>
