<script setup>
import { ref, watchEffect } from "vue";
import { BarChart } from "vue-chart-3";

import { surveyStore } from '@/stores/survey/surveyStore';
import { storeToRefs } from 'pinia';

const store = surveyStore();
const { statistics } = storeToRefs(store);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Nombre de réponses",
      data: [],
      backgroundColor: "#2B7FFF"
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: "Nombre de réponses par question",
      font: { size: 16 }
    }
  },
  scales: {
    y: { beginAtZero: true }
  }
});

watchEffect(() => {
  if (statistics.value && statistics.value.statistics?.length) {
    chartData.value.labels = statistics.value.statistics.map(
      q => q.question_libelle
    );

    chartData.value.datasets[0].data = statistics.value.statistics.map(
      q => q.nbreResponse
    );
  }
});
</script>

<template>
  <div class="p-4 border rounded shadow">
    <BarChart :chart-data="chartData" :chart-options="chartOptions" />
  </div>
</template>
