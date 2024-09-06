import { memo } from 'react';
import { isEmpty } from '@/utils/helpers/common';
import ApexCharts, { Props } from 'react-apexcharts';

const AreaChart = ({ data }: { data: number[] }) => {
  const options: Props['options'] = {
    annotations: {},
    chart: {
      animations: {
        enabled: true,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
        animateGradually: {
          enabled: false,
          delay: 150,
        },
        easing: "easeinout",
        speed: 800,
      },
      dropShadow: {
        left: 9,
        blur: 0,
      },
      fontFamily: "Lexend",
      id: "CGkfn",
      stackOnlyBar: true,
      toolbar: {
        show: false,
      },
      type: "area",
      width: '100%',
    },
    colors: [
      "#A7F442",
      "#7BDA08",
    ],
    dataLabels: {
      enabled: false,
      style: {
        fontWeight: 700,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    grid: {
      borderColor: '#F6F6F6',
    },
    legend: {
      fontSize: "12px",
      offsetY: 0,
      markers: {
        size: 7,
      },
      itemMargin: {
        vertical: 0,
      },
    },
    markers: {
      colors: [
        "#74D10C",
      ],
      strokeOpacity: 1,
      hover: {
        size: 5,
        sizeOffset: 6,
      },
    },
    stroke: {
      lineCap: "round",
      width: 3,
      colors: [
        "#A7F541",
      ],
      fill: {
        type: "solid",
      },
    },
    xaxis: {
      labels: {
        show: false,
        trim: true,
        style: {},
      },
      crosshairs: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false
      },
      group: {
        groups: [],
        style: {
          colors: [],
          fontSize: "12px",
          fontWeight: 400,
          cssClass: "",
        },
      },
      tickAmount: "dataPoints",
      title: {
        style: {
          fontWeight: 700,
        },
      },
    },
    yaxis: {
      show: false,
      tickAmount: 5,
      labels: {
        style: {},
      },
      title: {
        style: {
          fontWeight: 700,
        },
      },
    },
    theme: {
      palette: "palette4",
    },
    tooltip: {
      fillSeriesColor: false,
      intersect: false,
      onDatasetHover: {
        highlightDataSeries: false,
      },
      theme: 'transparent',
      style: {
        fontSize: '16px',
      },
      cssClass: 'custom-tooltip',
      inverseOrder: false,
      shared: false,
      marker: {
        show: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: () => {
            return '';
          },
        },
        formatter: (value: number) => {
          return `${value} DCO2`;
        },
      },

    },
  };

  return (
    <div>
      <ApexCharts
        options={options}
        series={[
          {
            name: 'DCO2',
            data: isEmpty(data) ? [0, 0] : data,
            group: "apexcharts-axis-0",
          },
        ]}
        type="area"
        width="100%"
        height={430}
      />
    </div >
  );
};

export default memo(AreaChart);
