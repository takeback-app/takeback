import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

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
}

const DoughnutChart: React.FC<React.PropsWithChildren<Props>> = ({ data }) => (
  <Doughnut
    width="300"
    height="300"
    options={{
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }}
    data={data}
  />
)

export default DoughnutChart
