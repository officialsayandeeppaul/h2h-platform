'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText } from 'lucide-react';

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    gstin: string;
    website: string;
  };
  patient: {
    name: string;
    phone: string;
    email: string;
  };
  appointment: {
    id: string;
    date: string;
    time: string;
    mode: string;
    status: string;
    paymentStatus: string;
  };
  service: {
    name: string;
    duration: number;
    doctor: string;
  };
  location: {
    name: string;
    city: string;
    address: string;
  };
  billing: {
    subtotal: number;
    gst: number;
    total: number;
    currency: string;
    paymentMethod: string;
    transactionId: string | null;
  };
  notes: string | null;
}

interface InvoiceDownloadProps {
  appointmentId: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function InvoiceDownload({ 
  appointmentId, 
  variant = 'outline',
  size = 'default',
  className = ''
}: InvoiceDownloadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvoiceHTML = (data: InvoiceData): string => {
    const fmtC = (a: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(a);
    const fmtD = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const fmtDLong = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const modeLabel = ({ online: 'Online Consultation', offline: 'Clinic Visit', home_visit: 'Home Visit' } as Record<string, string>)[data.appointment.mode] || data.appointment.mode;
    const isPaid = data.appointment.paymentStatus === 'paid';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${data.invoiceNumber} | H2H Healthcare</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;color:#1e293b;line-height:1.6;background:#f1f5f9}
.page{max-width:850px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.accent-bar{height:6px;background:linear-gradient(90deg,#0891b2,#06b6d4,#22d3ee)}
.header{display:flex;justify-content:space-between;align-items:flex-start;padding:36px 40px 28px}
.brand{display:flex;align-items:center;gap:14px}
.brand-icon{width:48px;height:48px;background:linear-gradient(135deg,#0891b2,#06b6d4);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:18px;letter-spacing:-0.5px}
.brand-text h2{font-size:20px;font-weight:700;color:#0f172a;letter-spacing:-0.3px}
.brand-text p{font-size:11px;color:#94a3b8;font-weight:500;letter-spacing:0.5px;text-transform:uppercase}
.inv-badge{text-align:right}
.inv-badge h1{font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#0891b2;margin-bottom:4px}
.inv-badge .inv-num{font-size:22px;font-weight:800;color:#0f172a;letter-spacing:-0.5px}
.inv-badge .inv-date{font-size:12px;color:#64748b;margin-top:6px;font-weight:500}
.divider{height:1px;background:#e2e8f0;margin:0 40px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:28px 40px}
.info-col{padding-right:30px}
.info-col:last-child{padding-right:0;padding-left:30px;border-left:1px solid #f1f5f9}
.info-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;margin-bottom:12px}
.info-name{font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px}
.info-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px}
.info-row .label{color:#64748b;font-weight:500}
.info-row .val{color:#1e293b;font-weight:600;text-align:right}
.mode-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;background:#ecfeff;color:#0891b2;border:1px solid #cffafe}
.svc-section{padding:0 40px 24px}
.svc-header{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#0891b2;margin-bottom:12px}
.svc-table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
.svc-table thead th{background:#f8fafc;padding:12px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#64748b;border-bottom:1px solid #e2e8f0}
.svc-table thead th:last-child{text-align:right}
.svc-table tbody td{padding:18px 16px;font-size:13px;color:#334155;font-weight:500}
.svc-table tbody td:first-child{font-weight:700;color:#0f172a;font-size:14px}
.svc-table tbody td:last-child{text-align:right;font-weight:700;color:#0f172a;font-size:15px}
.totals-wrap{display:flex;justify-content:flex-end;padding:0 40px 28px}
.totals{width:280px;background:#f8fafc;border-radius:10px;padding:16px 20px;border:1px solid #e2e8f0}
.totals-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#64748b;font-weight:500}
.totals-row .amt{color:#334155;font-weight:600}
.totals-row.grand{border-top:2px solid #0891b2;margin-top:10px;padding-top:12px}
.totals-row.grand span{font-size:18px;font-weight:800;color:#0891b2}
.pay-section{padding:0 40px 28px}
.pay-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.pay-card{background:#f8fafc;border-radius:8px;padding:14px 16px;border:1px solid #e2e8f0}
.pay-card .pc-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-bottom:4px}
.pay-card .pc-val{font-size:13px;font-weight:700;color:#0f172a}
.status-paid{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;background:#dcfce7;color:#166534;border:1px solid #bbf7d0}
.status-pending{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;background:#fef9c3;color:#854d0e;border:1px solid #fde68a}
.footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;display:flex;justify-content:space-between;align-items:center}
.footer-left p{font-size:11px;color:#94a3b8;line-height:1.7}
.footer-left p strong{color:#64748b}
.footer-right{text-align:right}
.footer-right .thank{font-size:14px;font-weight:700;color:#0891b2;margin-bottom:4px}
.footer-right p{font-size:11px;color:#94a3b8}
@media print{
  body{background:#fff}
  .page{margin:0;border-radius:0;box-shadow:none}
  .accent-bar{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  thead th,.mode-badge,.status-paid,.status-pending,.totals,.pay-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
</style>
</head>
<body>
<div class="page">
  <div class="accent-bar"></div>
  <div class="header">
    <div class="brand">
      <div class="brand-icon">H2H</div>
      <div class="brand-text">
        <h2>H2H Healthcare</h2>
        <p>Physiotherapy & Wellness</p>
      </div>
    </div>
    <div class="inv-badge">
      <h1>Invoice</h1>
      <div class="inv-num">${data.invoiceNumber}</div>
      <div class="inv-date">Issued ${fmtD(data.invoiceDate)}</div>
    </div>
  </div>
  <div class="divider"></div>
  <div class="info-grid">
    <div class="info-col">
      <div class="info-label">Billed To</div>
      <div class="info-name">${data.patient.name}</div>
      <div class="info-row"><span class="label">Phone</span><span class="val">${data.patient.phone || 'N/A'}</span></div>
      <div class="info-row"><span class="label">Email</span><span class="val" style="font-size:12px">${data.patient.email || 'N/A'}</span></div>
    </div>
    <div class="info-col">
      <div class="info-label">Appointment Details</div>
      <div class="info-row"><span class="label">Date</span><span class="val">${fmtDLong(data.appointment.date)}</span></div>
      <div class="info-row"><span class="label">Time</span><span class="val">${data.appointment.time}</span></div>
      <div class="info-row"><span class="label">Mode</span><span class="val"><span class="mode-badge">${modeLabel}</span></span></div>
      ${data.location.name ? '<div class="info-row"><span class="label">Location</span><span class="val">' + data.location.name + ', ' + data.location.city + '</span></div>' : ''}
    </div>
  </div>
  <div class="divider" style="margin-bottom:24px"></div>
  <div class="svc-section">
    <div class="svc-header">Service Details</div>
    <table class="svc-table">
      <thead><tr><th>Service</th><th>Doctor</th><th>Duration</th><th>Amount</th></tr></thead>
      <tbody><tr>
        <td>${data.service.name}</td>
        <td>Dr. ${data.service.doctor}</td>
        <td>${data.service.duration} mins</td>
        <td>${fmtC(data.billing.subtotal)}</td>
      </tr></tbody>
    </table>
  </div>
  <div class="totals-wrap">
    <div class="totals">
      <div class="totals-row"><span>Subtotal</span><span class="amt">${fmtC(data.billing.subtotal)}</span></div>
      <div class="totals-row"><span>GST (Included)</span><span class="amt">${fmtC(data.billing.gst)}</span></div>
      <div class="totals-row grand"><span>Total Payable</span><span>${fmtC(data.billing.total)}</span></div>
    </div>
  </div>
  <div class="divider" style="margin-bottom:24px"></div>
  <div class="pay-section">
    <div class="svc-header" style="margin-bottom:12px">Payment Information</div>
    <div class="pay-grid">
      <div class="pay-card">
        <div class="pc-label">Status</div>
        <div class="pc-val"><span class="${isPaid ? 'status-paid' : 'status-pending'}">${isPaid ? 'Paid' : 'Pending'}</span></div>
      </div>
      <div class="pay-card">
        <div class="pc-label">Method</div>
        <div class="pc-val">${data.billing.paymentMethod}</div>
      </div>
      <div class="pay-card">
        <div class="pc-label">Transaction ID</div>
        <div class="pc-val" style="font-size:11px;word-break:break-all">${data.billing.transactionId || 'N/A'}</div>
      </div>
    </div>
  </div>
  ${data.notes ? '<div style="padding:0 40px 24px"><div class="svc-header">Notes</div><div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;font-size:13px;color:#475569">' + data.notes + '</div></div>' : ''}
  <div class="footer">
    <div class="footer-left">
      <p><strong>${data.company.name}</strong></p>
      <p>${data.company.address}</p>
      <p>GSTIN: ${data.company.gstin}</p>
      <p style="margin-top:6px">This is a computer-generated invoice.</p>
    </div>
    <div class="footer-right">
      <div class="thank">Thank you!</div>
      <p>${data.company.phone}</p>
      <p>${data.company.email}</p>
      <p>${data.company.website}</p>
    </div>
  </div>
</div>
</body>
</html>`;
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch invoice data
      const res = await fetch(`/api/invoices/${appointmentId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch invoice data');
      }

      // Generate HTML
      const html = generateInvoiceHTML(data.data);

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Please allow popups to download the invoice');
      }

      printWindow.document.write(html);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
      };

    } catch (err: any) {
      setError(err.message || 'Failed to generate invoice');
      console.error('Invoice generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </>
        )}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
