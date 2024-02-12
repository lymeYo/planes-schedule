<script setup lang="ts">
import Chart from "chart.js/auto";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import { createDataFromFlightDates } from "./utils";
import type { Tschedule } from "../../types";
import type { Tdataset, TdatasetData } from "./types";

const props = defineProps<{dateTitle: number, data: Tschedule<true>[]}>();
const { data, dateTitle } = props;

const ctx = ref<HTMLCanvasElement | null>(null);
const chart = shallowRef<any>(null);
  
const renderChart = ({ labels, datasets }: { labels: string[], datasets: Tdataset[] }) => {
  if (ctx.value) chart.value = new Chart(ctx.value, {
    type: "bar",
    data: {
      labels,
      datasets,
    },
    options: {
      animations: undefined,
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        y: { stacked: true },
        x: {
          min: 0,
          max: 24,
          ticks: {
            stepSize: 3,
            autoSkip: false,
            callback: (value) =>
              value == 24 ? "" : `${("0" + value).slice(-2)}:00`,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          displayColors: false,
          callbacks: {
            title: () => {},
            label: (context) => { 
              const raw = context.raw as TdatasetData //нехорошо
              const labelInfo = raw[2];
              return [`Вылет: ${labelInfo.startForLabel}`, `Посадка: ${labelInfo.endForLabel}`];
            },
          },
        },
      },
    },
  });
};

const updateChart = ({ labels, datasets }: { labels: string[], datasets: Tdataset[] }) => {
  if (!chart.value) return
  
  chart.value.data.labels = labels;
  chart.value.data.datasets = datasets;
  chart.value.update();
};

const resizeChart = (yItemsLength: number) => {
  if (!chart.value) return

  const BAR_HEIGHT = window.innerWidth > 768 ? 100 : 80;
  if (chart.value.canvas.parentNode) (chart.value.canvas.parentNode as any).style.height = BAR_HEIGHT * yItemsLength + "px";
};

const createChartConfig = (scheduleData: Tschedule<true>[]) => {
  //заполнение datasets и labels
  const barClr = "rgb(70, 196, 169)";
  const barThickness = 50;
  const labels: string[] = scheduleData.map((d) => d.planeName);

  const datasetsLength = scheduleData.reduce(
    (max, value) =>
      value.flightsData.length > max ? value.flightsData.length : max,
    0
  );

  const datasets: Tdataset[] = Array.from(Array(datasetsLength)).map(() => ({
    data: [],
    backgroundColor: barClr,
    barThickness,
  }));

  scheduleData.forEach(({ flightsData }, dataInd) => {
    flightsData.forEach((flight, flightInd) => {
      const newData = createDataFromFlightDates(
        flight,
        dateTitle
      );
      if (newData) datasets[flightInd].data[dataInd] = newData
    });
  });

  return { labels, datasets };
};

watch(
  () => props.data,
  () => {
    const chartConfig = createChartConfig(props.data);
    resizeChart(props.data.length);
    updateChart(chartConfig);
  }
);

onMounted(() => {
  const chartConfig = createChartConfig(data);
  renderChart(chartConfig);
  resizeChart(data.length);
});

const title = computed(() =>
  new Date(dateTitle).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);
</script>

<template>
  <div class="canvas-wrapper">
    <h3 class="canvas-title">
      {{ title }}
    </h3>
    <canvas ref="ctx" aria-label="График расписанй"></canvas>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  max-width: 660px;
  height: min-content;
  margin: auto;
}

.canvas-title {
  font-size: 18px;
  color: #656565;
}

canvas {
  width: 100%;
}
</style>
