import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface DataSetsProps {
  label?: string
  data: Array<number>
  borderColor?: Array<string>
  backgroundColor?: Array<string>
  borderWidth?: number
}

interface DataProps {
  labels?: Array<string>
  datasets: Array<DataSetsProps>
}

interface Props {
  data: DataProps
  tooltipFormat: 'decimal' | 'percent'
  activeDataLabels?: boolean
  aspectRatio?: number
}

const DoughnutChart: React.FC<React.PropsWithChildren<Props>> = ({
  data,
  tooltipFormat,
  activeDataLabels = false,
  aspectRatio
}) => (
  <Doughnut
    options={{
      responsive: true,
      aspectRatio,
      plugins: {
        datalabels: {
          display: activeDataLabels,
          formatter: function (value) {
            return Math.round(value * 100) + '%'
          },
          labels: {
            title: {
              font: {
                weight: 'bold',
                size: 16
              }
            }
          }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label(tooltipItem) {
              if (tooltipFormat === 'percent') {
                const value = tooltipItem.raw as number
                const formatedNumber = value * 100
                return `${tooltipItem.label} - ${formatedNumber.toFixed(2)}%`
              }
              return `${tooltipItem.label} - ${tooltipItem.raw}`
            }
          }
        }
      }
    }}
    data={data}
  />
)

export default DoughnutChart
