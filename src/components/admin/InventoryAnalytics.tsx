"use client";
import { Bar } from 'react-chartjs-2';
import { Package} from "lucide-react";

export default function InventoryAnalytics({ inventoryData }: { inventoryData: any[] }) {
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  // Mapping the data to ensure we have a value for every group
  const chartValues = bloodGroups.map(group => {
    const found = inventoryData?.find(i => i._id === group);
    return found ? found.totalUnits : 0;
  });

  const data = {
    labels: bloodGroups,
    datasets: [
      {
        label: 'Units Available',
        data: chartValues,
        backgroundColor: chartValues.map(v => v < 5 ? '#ef4444' : '#0f172a'),
        borderRadius: 5,
        barThickness: 12,
      },
    ],
  };

  const options: any = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      y: { grid: { display: false } }
    },
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <Package className="text-red-600" size={24} /> 
            Blood Bank Inventory Vault
          </h3>
          <p className="text-slate-500 text-sm font-medium">Physical stock levels currently in the laboratory storage.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-slate-900" /> Sufficient
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg text-xs font-bold text-red-600">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Low Stock (&lt;5u)
           </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <Bar data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mt-8">
        {bloodGroups.map((group, idx) => (
          <div key={group} className={`p-3 rounded-2xl border ${chartValues[idx] < 5 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
            <p className="text-[10px] font-black uppercase text-slate-400">{group}</p>
            <p className={`text-xl font-black ${chartValues[idx] < 5 ? 'text-red-600' : 'text-slate-800'}`}>
              {chartValues[idx]}<span className="text-xs ml-1">u</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}