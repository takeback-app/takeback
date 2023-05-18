import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DataSetsProps {
  label?: string
  data: Array<number>
  fill: boolean
  borderColor: string
  tension: number
}

interface DataProps {
  labels?: Array<string>
  datasets: Array<DataSetsProps>
}

interface Props {
  data: DataProps
}

export const LineChart: React.FC<Props> = ({ data }) => (
  <Line
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          grid: {
            display: true
          }
          // ticks: {
          //   callback: function (value, index, ticks) {
          //     return `R$ ${value}`
          //   }
          // }
        }
      }
    }}
    data={data}
  />
)
