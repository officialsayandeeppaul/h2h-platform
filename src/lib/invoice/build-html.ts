import { APP_CONFIG } from '@/constants/config';
import type { InvoiceData } from './types';
import { escHtml, fmtCurrency, fmtDateLong, fmtDateShort, modeLabel } from './format';

function logoUrl(): string {
  const base = (
    (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('blob:')
      ? window.location.origin
      : APP_CONFIG.url) || 'https://healtohealth.in'
  ).replace(/\/$/, '');
  return `${base}/images/brand/logo-caps.webp`;
}

/**
 * Printable / downloadable invoice — email-style receipt.
 * Typography: semibold (600) only — never bold/700/800.
 * Labels: normal sentence case — never all-caps.
 */
export function buildInvoiceHtml(data: InvoiceData): string {
  const loc =
    data.location.name && data.location.city
      ? `${data.location.name}, ${data.location.city}`
      : data.location.name || modeLabel(data.appointment.mode);
  const paid = data.appointment.paymentStatus === 'paid';
  const logo = logoUrl();
  const safeNum = escHtml(data.invoiceNumber);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice ${safeNum} | H2H Healthcare</title>
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
  cursor:pointer;border:1px solid #0891b2;background:#0891b2;color:#fff;
}
.toolbar button:hover{background:#0e7490;border-color:#0e7490}
.shell{max-width:780px;margin:0 auto 40px;padding:0 16px}
.page{
  background:#fff;border-radius:12px;overflow:hidden;
  box-shadow:0 2px 16px rgba(15,23,42,.06);
}
.header{
  display:flex;justify-content:space-between;align-items:flex-start;gap:24px;
  padding:28px 32px 22px;
}
.brand{display:flex;align-items:center}
.brand-logo{height:48px;width:auto;max-width:220px;object-fit:contain;display:block}
.inv-meta{text-align:right}
.inv-meta .eyebrow{font-size:13px;font-weight:600;color:#0891b2;margin-bottom:4px}
.inv-meta .num{font-size:18px;font-weight:600;color:#0f172a}
.inv-meta .date{font-size:12px;color:#64748b;margin-top:4px;font-weight:400}
.rule{height:1px;background:#e2e8f0;margin:0 32px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:22px 32px}
.col{padding-right:28px}
.col + .col{padding-right:0;padding-left:28px;border-left:1px solid #f1f5f9}
.section-label{
  font-size:13px;font-weight:600;color:#0891b2;margin-bottom:10px;
}
.person{font-size:15px;font-weight:600;color:#0f172a;margin-bottom:8px}
.kv{display:flex;justify-content:space-between;gap:12px;padding:3px 0;font-size:12px}
.kv .k{color:#64748b;font-weight:400}
.kv .v{color:#1e293b;font-weight:500;text-align:right}
.mode{color:#0891b2;font-weight:600}
.block{padding:6px 32px 20px}
.table-wrap{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
table.svc{width:100%;border-collapse:collapse}
table.svc thead th{
  background:#f8fafc;padding:10px 14px;text-align:left;
  font-size:12px;font-weight:600;color:#64748b;
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
.pay-card .pl{font-size:12px;font-weight:600;color:#64748b;margin-bottom:6px}
.pay-card .pv{font-size:13px;font-weight:500;color:#0f172a;word-break:break-all}
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
.msg .title{display:block;font-size:13px;font-weight:600;color:#545454;margin-bottom:8px}
.msg p{font-size:13px;color:#999;line-height:1.65;font-weight:400}
@media (max-width:640px){
  .header,.grid{flex-direction:column;display:flex}
  .grid{grid-template-columns:1fr}
  .col + .col{border-left:none;padding-left:0;padding-top:18px;border-top:1px solid #f1f5f9;margin-top:8px}
  .pay-grid{grid-template-columns:1fr}
  .footer{flex-direction:column;align-items:flex-start}
  .footer-right{text-align:left}
  .brand-logo{height:40px}
}
@media print{
  body{background:#fff;margin:0}
  .toolbar{display:none!important}
  .shell{margin:0;padding:0;max-width:none}
  .page{box-shadow:none;border-radius:0}
  .brand-logo,.pay-card,table.svc thead th,.t-grand{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  @page{margin:12mm;size:A4}
}
</style>
</head>
<body>
<div class="toolbar">
  <button type="button" onclick="window.print()">Download PDF</button>
</div>
<div class="shell">
  <div class="page">
    <div class="header">
      <div class="brand">
        <img class="brand-logo" src="${escHtml(logo)}" alt="${escHtml(data.company.name)}" width="220" height="48" />
      </div>
      <div class="inv-meta">
        <div class="eyebrow">Invoice</div>
        <div class="num">${safeNum}</div>
        <div class="date">Issued ${fmtDateShort(data.invoiceDate)}</div>
      </div>
    </div>

    <div class="rule"></div>

    <div class="grid">
      <div class="col">
        <div class="section-label">Billed to</div>
        <div class="person">${escHtml(data.patient.name)}</div>
        <div class="kv"><span class="k">Phone</span><span class="v">${escHtml(data.patient.phone || 'N/A')}</span></div>
        <div class="kv"><span class="k">Email</span><span class="v">${escHtml(data.patient.email || 'N/A')}</span></div>
      </div>
      <div class="col">
        <div class="section-label">Appointment details</div>
        <div class="kv"><span class="k">Date</span><span class="v">${fmtDateLong(data.appointment.date)}</span></div>
        <div class="kv"><span class="k">Time</span><span class="v">${escHtml(data.appointment.time)}</span></div>
        <div class="kv"><span class="k">Mode</span><span class="v"><span class="mode">${escHtml(modeLabel(data.appointment.mode))}</span></span></div>
        ${data.location.name ? `<div class="kv"><span class="k">Location</span><span class="v">${escHtml(loc)}</span></div>` : ''}
      </div>
    </div>

    <div class="block">
      <div class="section-label">Service details</div>
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
        <div class="t-row"><span>GST (included)</span><span>${fmtCurrency(data.billing.gst)}</span></div>
        <div class="t-row t-grand"><span>Total payable</span><span>${fmtCurrency(data.billing.total)}</span></div>
      </div>
    </div>

    <div class="pay">
      <div class="section-label">Payment information</div>
      <div class="pay-grid">
        <div class="pay-card">
          <div class="pl">Status</div>
          <div class="pv">${paid ? 'Paid' : 'Pending'}</div>
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
