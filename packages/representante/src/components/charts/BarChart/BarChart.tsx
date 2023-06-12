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
import { maskCurrency } from '../../../utils/masks'

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
}

const BarChart: React.FC<React.PropsWithChildren<Props>> = ({ data }) => (
  <Bar
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          display: false
        },
        tooltip: {
          callbacks: {
            label(tooltipItem) {
              return maskCurrency(tooltipItem.raw as number)
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

export default BarChart
