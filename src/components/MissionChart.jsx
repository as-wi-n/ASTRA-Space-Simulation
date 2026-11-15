import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

export default function MissionChart({ history }) {
  const labels = history.map((h) => `D${h.day}`)
  const data = {
    labels,
    datasets: [
      { label: 'Oxygen', data: history.map((h) => h.oxygen), borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.15)', tension: 0.3 },
      { label: 'Water', data: history.map((h) => h.water), borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.12)', tension: 0.3 },
      { label: 'Food', data: history.map((h) => h.food), borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.12)', tension: 0.3 },
      { label: 'Electricity', data: history.map((h) => h.electricity), borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.10)', tension: 0.3 },
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.12)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.12)' } },
    },
  }
  return (
    <div className="h-72">
      <Line data={data} options={options} />
    </div>
  )
}
