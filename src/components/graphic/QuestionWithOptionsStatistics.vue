<script setup>
import { ref, watchEffect } from "vue";
import { BarChart } from "vue-chart-3";

import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

import { surveyStore } from '@/stores/survey/surveyStore';
import { storeToRefs } from 'pinia';

const store = surveyStore();
const { statistics } = storeToRefs(store);

const chartsData = ref([]);

watchEffect(() => {
  if (statistics.value && statistics.value?.statistics?.length > 0) {
    const optionQuestions = statistics.value.statistics.filter(
      (q) => q.responsesOptions && q.responsesOptions.length > 0
    );

    chartsData.value = optionQuestions.map((q) => {
      const labels = q.responsesOptions.map((opt) => opt.libelle);
      const counts = q.responsesOptions.map((opt) => opt.count);

      return {
        question: q.question_libelle,
        chartData: {
          labels,
          datasets: [
            {
              label: "Réponses par options",
              data: counts,
              backgroundColor: ["#2B7FFF", "#FF6B6B", "#FFD93D"], // tu peux adapter
            },
          ],
        },
        chartOptions: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: q.question_libelle,
            },
          },
        },
      };
    });
  }
});
</script>

<template>
  <div>
    <div
      v-for="(chart, index) in chartsData"
      :key="index"
      class="mb-8 p-4 border rounded-lg shadow"
    >
    <h1>{{ chart.question }}</h1>
      <BarChart :chart-data="chart.chartData" :chart-options="chart.chartOptions" />
    </div>
  </div>
</template>
