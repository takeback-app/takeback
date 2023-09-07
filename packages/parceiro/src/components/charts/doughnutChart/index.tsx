import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }
  ]
}

interface DataSetsProps {
  label: string
  data: Array<number>
  borderColor: Array<string>
  backgroundColor: Array<string>
  borderWidth: number
}

interface DataProps {
  labels?: Array<string>
  datasets: Array<DataSetsProps>
}

interface Props {
  data: DataProps
  tooltipFormat: 'decimal' | 'percent'
}

export const DoughnutChart: React.FC<Props> = ({ data, tooltipFormat }) => (
  <Doughnut
    options={{
      responsive: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
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
