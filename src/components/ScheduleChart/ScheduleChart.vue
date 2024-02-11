<script setup>
import Chart from "chart.js/auto";
import { computed, onMounted, onUpdated, ref, shallowRef, watch } from "vue";
import { createTimeStringFromInt } from "../../utils";

const props = defineProps(["dateTitle", "data"]);
const { data, dateTitle } = props;

const ctx = ref(null);
const chart = shallowRef(null);

const renderChart = ({ labels, datasets }) => {
  chart.value = new Chart(ctx.value, {
    type: "bar",
    data: {
      labels,
      datasets,
      // datasets: [
      //   {
      //     data: [null, [(1, 6)]],
      //     backgroundColor: "rgb(70, 196, 169)",
      //   },
      //   {
      //     data: [
      //       [6, 8.5],
      //       [6, 8.33],
      //     ],
      //     backgroundColor: "rgb(70, 196, 169)",
      //   },
      // ],
    },
    options: {
      animations: false,
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
            title: () => null,
            label: function (context) {
              const startFlightStr = createTimeStringFromInt(context.raw[0]);
              const endFlightStr = createTimeStringFromInt(context.raw[1]);

              return [`Вылет: ${startFlightStr}`, `Посадка: ${endFlightStr}`];
            },
          },
        },
      },
    },
  });
};

const updateChart = ({ labels, datasets }) => {
  chart.value.data.labels = labels;
  chart.value.data.datasets = datasets;
  chart.value.update();
};

const resizeChart = (yItemsLength) => {
  const BAR_HEIGHT = window.innerWidth > 768 ? 100 : 80;
  chart.value.canvas.parentNode.style.height = BAR_HEIGHT * yItemsLength + "px";
};

const createChartConfig = (scheduleData) => {
  //заполнение datasets и labels
  const barClr = "rgb(70, 196, 169)";
  const labels = scheduleData.map((d) => d.planeName);

  const datasetsLength = scheduleData.reduce(
    (max, value) =>
      value.flightsData.length > max ? value.flightsData.length : max,
    0
  );

  const datasets = Array.from(Array(datasetsLength)).map(() => ({
    data: [],
    backgroundColor: barClr,
    barThickness: 50,
  }));

  scheduleData.forEach(({ flightsData }, dataInd) => {
    flightsData.forEach((flight, flightInd) => {
      datasets[flightInd].data[dataInd] = [flight.timeStart, flight.timeEnd];
    });
  });

  return { labels, datasets };
};

onMounted(() => {
  const chartConfig = createChartConfig(data);
  renderChart(chartConfig);
  resizeChart(data.length);
});

watch(
  () => props.data,
  () => {
    const chartConfig = createChartConfig(props.data);
    resizeChart(props.data.length);
    updateChart(chartConfig);
  }
);

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
