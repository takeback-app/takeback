import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
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

const LineChart: React.FC<React.PropsWithChildren<Props>> = ({ data }) => (
  <Line
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          display: false
        },
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

export default LineChart
