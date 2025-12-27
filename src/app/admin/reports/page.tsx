"use client";
import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { 
  Users, Clock, Activity,
  Download, CheckCircle2, Loader2, ChevronDown, Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- IMPORTANT: Registering ChartJS Components to fix "category scale" error ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminReports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/reports');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Failed to load report data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- PDF Generation Logic ---
  const handleDownload = (type: "Daily" | "Weekly" | "Monthly") => {
    if (!data) return;

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38); // Red color
    doc.text(`Blood Donation ${type} Report`, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${dateStr}`, 14, 28);

    // KPI Table
    autoTable(doc, {
      startY: 35,
      head: [['Metric', 'Statistics']],
      body: [
        ['Total Registered Donors', data.stats.totalDonors],
        ['Total Registered Receivers', data.stats.totalReceivers],
        ['Pending Requests', data.stats.pendingRequests],
        ['Request Fulfillment Rate', data.stats.fulfillmentRate],
      ],
      theme: 'striped',
      headStyles: { fillColor: [220, 38, 38] }
    });

    // Detailed Inventory vs Requests Table
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Blood Group Analysis (Supply vs Demand)", 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Blood Group', 'Available Donors (Supply)', 'Blood Requests (Demand)']],
      body: data.inventory.map((item: any, index: number) => [
        item._id,
        item.totalUnits,
        data.requests[index].totalUnits
      ]),
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`Blood_Bank_${type}_Report_${dateStr.replace(/\//g, '-')}.pdf`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="text-gray-500 font-bold">Syncing Analytics...</p>
    </div>
  );

  // Setup data for Charts
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const inventoryData = data.inventory.map((i: any) => i.totalUnits);
  const requestData = data.requests.map((r: any) => r.totalUnits);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Activity className="text-red-600" size={32} /> Admin Insights
            </h1>
            <p className="text-slate-500 font-medium">Real-time supply and demand monitoring.</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200">
              <Download size={18} /> Download Report <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 rounded-xl p-2 font-semibold bg-white border shadow-xl">
              <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => handleDownload('Daily')}>
                <Calendar size={14}/> Daily Report
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => handleDownload('Weekly')}>
                <Calendar size={14}/> Weekly Report
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => handleDownload('Monthly')}>
                <Calendar size={14}/> Monthly Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard title="Total Donors" value={data.stats.totalDonors} icon={<Users />} color="red" />
          <KPICard title="Total Receivers" value={data.stats.totalReceivers} icon={<Users />} color="blue" />
          <KPICard title="Pending" value={data.stats.pendingRequests} icon={<Clock />} color="amber" />
          <KPICard title="Success Rate" value={data.stats.fulfillmentRate} icon={<CheckCircle2 />} color="emerald" />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Comparison Bar Chart: Supply vs Demand */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black mb-6">Blood Group Breakdown: Supply vs Demand</h3>
            <div className="h-[350px]">
              <Bar 
                options={{ 
                  maintainAspectRatio: false, 
                  responsive: true,
                  plugins: { legend: { position: 'top' } },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true }
                  }
                }}
                data={{
                  labels: bloodGroups,
                  datasets: [
                    {
                      label: 'Available Donors (Supply)',
                      data: inventoryData,
                      backgroundColor: '#dc2626',
                      borderRadius: 6,
                    },
                    {
                      label: 'Requests (Demand)',
                      data: requestData,
                      backgroundColor: '#3b82f6',
                      borderRadius: 6,
                    }
                  ]
                }} 
              />
            </div>
          </div>

          {/* User Composition */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black mb-6">User Base</h3>
            <div className="h-[300px]">
              <Doughnut 
                options={{ maintainAspectRatio: false, cutout: '70%' }}
                data={{
                  labels: ['Donors', 'Receivers'],
                  datasets: [{
                    data: [data.stats.totalDonors, data.stats.totalReceivers],
                    backgroundColor: ['#dc2626', '#3b82f6'],
                    borderWidth: 0,
                  }]
                }}
              />
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm font-bold">
                    <span>Donors:</span> <span className="text-red-600">{data.stats.totalDonors}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                    <span>Receivers:</span> <span className="text-blue-600">{data.stats.totalReceivers}</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color }: any) {
  const colorMap: any = {
    red: "text-red-600 bg-red-50 border-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colorMap[color]}`}>
        {icon}
      </div>
      <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black mt-1 text-slate-800">{value ?? 0}</h2>
    </div>
  );
}