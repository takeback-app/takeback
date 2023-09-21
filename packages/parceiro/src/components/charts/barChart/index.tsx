import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { currencyFormat } from '../../../utils/currencyFormat'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
)

interface DataSetsProps {
  label?: string
  data: Array<number>
  borderColor?: Array<string>
  backgroundColor?: Array<string>
  borderWidth?: number
  borderRadius?: number
}

interface DataProps {
  labels?: Array<string>
  datasets: Array<DataSetsProps>
}

interface Props {
  data: DataProps
  tooltipFormat: 'decimal' | 'percent' | 'currency'
  datalabels: boolean
}

export const BarChart: React.FC<React.PropsWithChildren<Props>> = ({
  data,
  tooltipFormat,
  datalabels
}) => (
  <Bar
    width="200"
    height="200"
    options={{
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 30
        }
      },
      plugins: {
        datalabels: {
          display: datalabels,
          formatter: function (value) {
            if (tooltipFormat === 'percent') {
              const formatedNumber = value * 100
              return `${formatedNumber.toFixed(2)}%`
            }
            if (tooltipFormat === 'currency') {
              return currencyFormat(value)
            }
            return value
          },
          anchor: 'end',
          align: 'top',
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
          position: 'bottom',
          display: false
        },
        tooltip: {
          callbacks: {
            label(tooltipItem) {
              const value = tooltipItem.raw as number
              if (tooltipFormat === 'percent') {
                const formatedNumber = value * 100
                return `${formatedNumber.toFixed(2)}%`
              }
              if (tooltipFormat === 'currency') {
                return currencyFormat(value)
              }
              return `${value}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: false
        }
      }
    }}
    data={data}
  />
)
