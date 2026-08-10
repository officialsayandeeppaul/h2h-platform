import type { InvoiceData } from './types';
import { escHtml, fmtCurrency, fmtDateLong, fmtDateShort, modeLabel } from './format';

/**
 * Printable / downloadable invoice — email-style receipt.
 * Typography: semibold (600) only — never bold/700/800.
 */
export function buildInvoiceHtml(data: InvoiceData): string {
  const loc =
    data.location.name && data.location.city
      ? `${data.location.name}, ${data.location.city}`
      : data.location.name || modeLabel(data.appointment.mode);
  const paid = data.appointment.paymentStatus === 'paid';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice ${escHtml(data.invoiceNumber)} | H2H Healthcare</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
  font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:#1e293b;
  background:rgba(235,238,255,1);
  line-height:1.5;
  -webkit-font-smoothing:antialiased;
  margin-top:20px;
  font-weight:400;
}
.toolbar{max-width:780px;margin:0 auto 12px;padding:0 16px;display:flex;justify-content:flex-end;gap:8px}
.toolbar button{
  font-family:inherit;padding:9px 18px;border-radius:8px;font-size:12px;font-weight:600;
  cursor:pointer;border:1px solid #e2e8f0;background:#fff;color:#334155;
}
.toolbar button.primary{background:#0891b2;color:#fff;border-color:#0891b2}
.shell{max-width:780px;margin:0 auto 40px;padding:0 16px}
.page{
  background:#fff;border-radius:12px;overflow:hidden;
  box-shadow:0 2px 16px rgba(15,23,42,.06);
  border-top:4px solid #0891b2;
}
.header{
  display:flex;justify-content:space-between;align-items:flex-start;gap:24px;
  padding:28px 32px 22px;
}
.brand{display:flex;align-items:center;gap:12px}
.brand-mark{
  width:40px;height:40px;border-radius:10px;
  background:linear-gradient(135deg,#0891b2,#06b6d4);
  color:#fff;display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:600;letter-spacing:.02em;
}
.brand h2{font-size:17px;font-weight:600;color:#0f172a;letter-spacing:-.01em}
.brand p{font-size:10px;font-weight:500;color:#94a3b8;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
.inv-meta{text-align:right}
.inv-meta .eyebrow{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#0891b2;margin-bottom:4px}
.inv-meta .num{font-size:18px;font-weight:600;color:#0f172a}
.inv-meta .date{font-size:12px;color:#64748b;margin-top:4px;font-weight:400}
.rule{height:1px;background:#e2e8f0;margin:0 32px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:22px 32px}
.col{padding-right:28px}
.col + .col{padding-right:0;padding-left:28px;border-left:1px solid #f1f5f9}
.section-label{
  font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:#0891b2;margin-bottom:10px;
}
.person{font-size:15px;font-weight:600;color:#0f172a;margin-bottom:8px}
.kv{display:flex;justify-content:space-between;gap:12px;padding:3px 0;font-size:12px}
.kv .k{color:#64748b;font-weight:400}
.kv .v{color:#1e293b;font-weight:500;text-align:right}
.mode{
  display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;
  background:#ecfeff;color:#0891b2;border:1px solid #cffafe;
}
.block{padding:6px 32px 20px}
.table-wrap{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
table.svc{width:100%;border-collapse:collapse}
table.svc thead th{
  background:#f8fafc;padding:10px 14px;text-align:left;
  font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#64748b;
  border-bottom:1px solid #e2e8f0;
}
table.svc thead th:last-child{text-align:right}
table.svc tbody td{
  padding:14px;font-size:13px;color:#334155;font-weight:400;border-bottom:1px solid #f1f5f9;
}
table.svc tbody td:first-child{font-weight:600;color:#0f172a}
table.svc tbody td:last-child{text-align:right;font-weight:600;color:#0f172a}
.totals{display:flex;justify-content:flex-end;padding:0 32px 20px}
.totals-box{min-width:240px}
.t-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;color:#64748b}
.t-row span:last-child{color:#334155;font-weight:500}
.t-grand{
  margin-top:8px;padding:10px 0;border-top:1.5px solid #0891b2;border-bottom:1.5px solid #0891b2;
}
.t-grand span{font-size:14px;font-weight:600;color:#0891b2}
.pay{padding:0 32px 24px}
.pay-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.pay-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px}
.pay-card .pl{font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px}
.pay-card .pv{font-size:12px;font-weight:500;color:#0f172a;word-break:break-all}
.badge{
  display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;
}
.badge-paid{background:#dcfce7;color:#166534;border:1px solid #bbf7d0}
.badge-pending{background:#fef9c3;color:#854d0e;border:1px solid #fde68a}
.footer{
  display:flex;justify-content:space-between;gap:24px;align-items:flex-end;
  padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;
}
.footer-left p{font-size:11px;color:#94a3b8;line-height:1.55;font-weight:400}
.footer-left .co{font-weight:600;color:#64748b}
.footer-right{text-align:right}
.footer-right .thanks{font-size:15px;font-weight:600;color:#0891b2;margin-bottom:4px}
.footer-right p{font-size:11px;color:#94a3b8;line-height:1.5}
.msg{padding:0 32px 20px}
.msg .title{display:block;font-size:13px;font-weight:600;color:#545454;text-transform:uppercase;margin-bottom:8px;letter-spacing:.06em}
.msg p{font-size:13px;color:#999;line-height:1.65;font-weight:400}
@media (max-width:640px){
  .header,.grid{flex-direction:column;display:flex}
  .grid{grid-template-columns:1fr}
  .col + .col{border-left:none;padding-left:0;padding-top:18px;border-top:1px solid #f1f5f9;margin-top:8px}
  .pay-grid{grid-template-columns:1fr}
  .footer{flex-direction:column;align-items:flex-start}
  .footer-right{text-align:left}
}
@media print{
  body{background:#fff;margin:0}
  .toolbar{display:none!important}
  .shell{margin:0;padding:0;max-width:none}
  .page{box-shadow:none;border-radius:0}
  .brand-mark,.mode,.badge,.pay-card,table.svc thead th,.t-grand{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{margin:12mm;size:A4}
}
</style>
</head>
<body>
<div class="toolbar">
  <button type="button" onclick="(function(){var a=document.createElement('a');a.href='data:text/html;charset=utf-8,'+encodeURIComponent(document.documentElement.outerHTML);a.download='Invoice-${escHtml(data.invoiceNumber)}.html';a.click();})()">Download</button>
  <button type="button" class="primary" onclick="window.print()">Save as PDF</button>
</div>
<div class="shell">
  <div class="page">
    <div class="header">
      <div class="brand">
        <div class="brand-mark">H2H</div>
        <div>
          <h2>${escHtml(data.company.name)}</h2>
          <p>Physiotherapy &amp; Wellness</p>
        </div>
      </div>
      <div class="inv-meta">
        <div class="eyebrow">Invoice</div>
        <div class="num">${escHtml(data.invoiceNumber)}</div>
        <div class="date">Issued ${fmtDateShort(data.invoiceDate)}</div>
      </div>
    </div>

    <div class="rule"></div>

    <div class="grid">
      <div class="col">
        <div class="section-label">Billed To</div>
        <div class="person">${escHtml(data.patient.name)}</div>
        <div class="kv"><span class="k">Phone</span><span class="v">${escHtml(data.patient.phone || 'N/A')}</span></div>
        <div class="kv"><span class="k">Email</span><span class="v">${escHtml(data.patient.email || 'N/A')}</span></div>
      </div>
      <div class="col">
        <div class="section-label">Appointment Details</div>
        <div class="kv"><span class="k">Date</span><span class="v">${fmtDateLong(data.appointment.date)}</span></div>
        <div class="kv"><span class="k">Time</span><span class="v">${escHtml(data.appointment.time)}</span></div>
        <div class="kv"><span class="k">Mode</span><span class="v"><span class="mode">${escHtml(modeLabel(data.appointment.mode))}</span></span></div>
        ${data.location.name ? `<div class="kv"><span class="k">Location</span><span class="v">${escHtml(loc)}</span></div>` : ''}
      </div>
    </div>

    <div class="block">
      <div class="section-label">Service Details</div>
      <div class="table-wrap">
        <table class="svc">
          <thead>
            <tr>
              <th style="width:42%">Service</th>
              <th style="width:28%">Doctor</th>
              <th style="width:15%">Duration</th>
              <th style="width:15%">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${escHtml(data.service.name)}</td>
              <td>Dr. ${escHtml(data.service.doctor)}</td>
              <td>${data.service.duration} mins</td>
              <td>${fmtCurrency(data.billing.subtotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="totals">
      <div class="totals-box">
        <div class="t-row"><span>Subtotal</span><span>${fmtCurrency(data.billing.subtotal)}</span></div>
        <div class="t-row"><span>GST (Included)</span><span>${fmtCurrency(data.billing.gst)}</span></div>
        <div class="t-row t-grand"><span>Total Payable</span><span>${fmtCurrency(data.billing.total)}</span></div>
      </div>
    </div>

    <div class="pay">
      <div class="section-label">Payment Information</div>
      <div class="pay-grid">
        <div class="pay-card">
          <div class="pl">Status</div>
          <div class="pv"><span class="badge ${paid ? 'badge-paid' : 'badge-pending'}">${paid ? 'Paid' : 'Pending'}</span></div>
        </div>
        <div class="pay-card">
          <div class="pl">Method</div>
          <div class="pv">${escHtml(data.billing.paymentMethod)}</div>
        </div>
        <div class="pay-card">
          <div class="pl">Transaction ID</div>
          <div class="pv" style="font-family:ui-monospace,Consolas,monospace;font-size:11px">${data.billing.transactionId ? escHtml(data.billing.transactionId) : 'N/A'}</div>
        </div>
      </div>
    </div>

    <div class="msg">
      <span class="title">Thank you for contacting us!</span>
      <p>Your appointment is confirmed. Keep this invoice for your records. For support, reply to your confirmation email or call us.</p>
    </div>

    <div class="footer">
      <div class="footer-left">
        <p class="co">${escHtml(data.company.name)}</p>
        <p>${escHtml(data.company.address)}</p>
        <p>GSTIN: ${escHtml(data.company.gstin)}</p>
        <p style="margin-top:6px;font-size:10px">Computer-generated invoice</p>
      </div>
      <div class="footer-right">
        <div class="thanks">Thank you!</div>
        <p>${escHtml(data.company.email)}</p>
        <p>${escHtml(data.company.phone)}</p>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}
