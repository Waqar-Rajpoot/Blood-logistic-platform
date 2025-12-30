"use client";
import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InventoryAnalytics from "@/components/admin/InventoryAnalytics";
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
  Download, CheckCircle2, Loader2, ChevronDown, FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement, 
  PointElement, LineElement, Title, Tooltip, Legend, Filler
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

  // --- COMPREHENSIVE PDF GENERATION ---
  const handleDownload = (type: "Daily" | "Weekly" | "Monthly") => {
    if (!data) return;
    
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const dateFile = new Date().toLocaleDateString().replace(/\//g, '-');

    // 1. Header & Branding
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("BLOOD BANK MANAGEMENT SYSTEM", 14, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${type.toUpperCase()} ANALYTICS REPORT`, 14, 30);

    // 2. Report Metadata
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Report Generated: ${timestamp}`, 14, 50);
    doc.text(`Status: Official Record`, 14, 55);

    // 3. KPI Summary Table
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.text("Executive Summary", 14, 70);
    autoTable(doc, {
      startY: 75,
      head: [['Metric Description', 'Value']],
      body: [
        ['Total Registered Donors', data.stats.totalDonors],
        ['Total Registered Receivers', data.stats.totalReceivers],
        ['Total Pending Requests', data.stats.pendingRequests],
        ['Request Fulfillment Rate', `${data.stats.fulfillmentRate}%`],
      ],
      headStyles: { fillColor: [220, 38, 38] },
      theme: 'striped'
    });

    // 4. Inventory Storage Table
    const finalY1 = (doc as any).lastAutoTable.finalY;
    doc.text("Physical Inventory Storage (Units)", 14, finalY1 + 15);
    autoTable(doc, {
      startY: finalY1 + 20,
      head: [['Blood Group', 'Units in Vault', 'Status']],
      body: data.inventory.map((item: any) => [
        item._id,
        item.totalUnits,
        item.totalUnits < 5 ? "LOW STOCK" : "STABLE"
      ]),
      headStyles: { fillColor: [31, 41, 55] },
      columnStyles: {
        2: { fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.column.index === 2 && data.cell.text[0] === 'LOW STOCK') {
            data.cell.styles.textColor = [220, 38, 38];
        }
      }
    });

    // 5. Supply vs Demand Table
    const finalY2 = (doc as any).lastAutoTable.finalY;
    doc.text("Supply vs Demand Analysis", 14, finalY2 + 15);
    autoTable(doc, {
      startY: finalY2 + 20,
      head: [['Blood Group', 'Available Donors', 'Active Requests']],
      body: data.inventory.map((item: any, index: number) => [
        item._id,
        item.totalUnits,
        data.requests[index]?.totalUnits || 0
      ]),
      headStyles: { fillColor: [37, 99, 235] }, // Blue
    });

    // 6. Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - Confidential Admin Document`, 105, 290, { align: "center" });
    }

    doc.save(`Full_Blood_Report_${type}_${dateFile}.pdf`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="animate-spin text-red-600 mb-4" size={40} />
      <p className="text-gray-500 font-bold">Syncing Analytics...</p>
    </div>
  );

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const inventoryData = data.inventory.map((i: any) => i.totalUnits);
  const requestData = data.requests.map((r: any) => r.totalUnits);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Activity className="text-red-600" size={32} /> Admin Insights
            </h1>
            <p className="text-slate-500 font-medium">Real-time supply and demand monitoring.</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200">
              <Download size={18} /> Download Full Report <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl p-2 font-semibold bg-white border shadow-xl">
              <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => handleDownload('Daily')}>
                <FileText size={16}/> Daily Audit PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => handleDownload('Weekly')}>
                <FileText size={16}/> Weekly Summary PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2" onClick={() => handleDownload('Monthly')}>
                <FileText size={16}/> Monthly Full Record PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Donors" value={data.stats.totalDonors} icon={<Users />} color="red" />
          <KPICard title="Total Receivers" value={data.stats.totalReceivers} icon={<Users />} color="blue" />
          <KPICard title="Pending Requests" value={data.stats.pendingRequests} icon={<Clock />} color="amber" />
          <KPICard title="Success Rate" value={`${data.stats.fulfillmentRate}`} icon={<CheckCircle2 />} color="emerald" />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black mb-6">Supply vs Demand Breakdown</h3>
            <div className="h-[350px]">
              <Bar 
                options={{ maintainAspectRatio: false, responsive: true }}
                data={{
                  labels: bloodGroups,
                  datasets: [
                    { label: 'Donors', data: inventoryData, backgroundColor: '#dc2626', borderRadius: 6 },
                    { label: 'Requests', data: requestData, backgroundColor: '#3b82f6', borderRadius: 6 }
                  ]
                }} 
              />
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black mb-6">User Composition</h3>
            <div className="h-[300px]">
              <Doughnut 
                options={{ maintainAspectRatio: false, cutout: '70%' }}
                data={{
                  labels: ['Donors', 'Receivers', 'Pending Requests'],
                  datasets: [{
                    data: [data.stats.totalDonors, data.stats.totalReceivers, data.stats.pendingRequests],
                    backgroundColor: ['#dc2626', '#3b82f6', '#fbbf24'],
                    borderWidth: 0,
                  }]
                }}
              />
            </div>
              <div>
                <p className="text-sm text-[#dc2626] font-bold">Donors: {data.stats.totalDonors}</p>
                <p className="text-sm text-[#3b82f6] font-bold">Receivers: {data.stats.totalReceivers}</p>
                <p className="text-sm text-[#aa8017] font-bold">Pending Requests: {data.stats.pendingRequests}</p>
              </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="w-full">
            <InventoryAnalytics inventoryData={data.inventory} />
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

