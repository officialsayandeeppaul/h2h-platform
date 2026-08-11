import { APP_CONFIG } from '@/constants/config';
import type { InvoiceData } from './types';
import { escHtml, fmtCurrency, fmtDateShort, modeLabel } from './format';

/** Email-safe inline invoice (semibold only — never bold/700+; normal casing, no all-caps). */
export function buildInvoiceEmailSection(data: InvoiceData): string {
  const loc =
    data.location.name && data.location.city
      ? `${data.location.name}, ${data.location.city}`
      : data.location.name || modeLabel(data.appointment.mode);
  const paid = data.appointment.paymentStatus === 'paid';
  const txn = data.billing.transactionId
    ? escHtml(data.billing.transactionId)
    : '—';
  const f =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const logo = `${APP_CONFIG.url.replace(/\/$/, '')}/images/brand/logo-email.png`;

  return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 20px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;background:#ffffff;">
  <tr>
    <td style="padding:20px 24px 16px;border-bottom:1px solid #eef2f6;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="vertical-align:middle;">
            <img src="${logo}" alt="${escHtml(data.company.name)}" width="160" height="40" style="display:block;height:40px;width:auto;max-width:160px;border:0;" />
          </td>
          <td align="right" style="vertical-align:top;">
            <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#0891b2;font-family:${f};">Invoice</p>
            <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;font-family:${f};">${escHtml(data.invoiceNumber)}</p>
            <p style="margin:4px 0 0;font-size:11px;color:#64748b;font-family:${f};">Issued ${fmtDateShort(data.invoiceDate)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 24px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td width="50%" style="vertical-align:top;padding-right:12px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0891b2;font-family:${f};">Billed to</p>
            <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#0f172a;font-family:${f};">${escHtml(data.patient.name)}</p>
            <p style="margin:0;font-size:12px;color:#64748b;line-height:1.55;font-family:${f};">
              ${data.patient.phone ? escHtml(data.patient.phone) + '<br/>' : ''}
              ${data.patient.email ? escHtml(data.patient.email) : ''}
            </p>
          </td>
          <td width="50%" style="vertical-align:top;padding-left:12px;border-left:1px solid #f1f5f9;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0891b2;font-family:${f};">Appointment details</p>
            <p style="margin:0;font-size:12px;color:#334155;line-height:1.55;font-family:${f};">
              ${fmtDateShort(data.appointment.date)} · ${escHtml(data.appointment.time)}<br/>
              ${escHtml(modeLabel(data.appointment.mode))}<br/>
              ${escHtml(loc)}
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 24px 0;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0891b2;font-family:${f};">Service details</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <thead>
          <tr style="background:#f8fafc;">
            <th align="left" style="padding:10px 12px;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;font-family:${f};">Service</th>
            <th align="left" style="padding:10px 8px;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;font-family:${f};">Doctor</th>
            <th align="right" style="padding:10px 12px;font-size:12px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;font-family:${f};">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:14px 12px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;font-family:${f};">${escHtml(data.service.name)}<br/><span style="font-size:11px;font-weight:400;color:#64748b;">${data.service.duration} mins</span></td>
            <td style="padding:14px 8px;font-size:12px;font-weight:400;color:#334155;border-bottom:1px solid #f1f5f9;font-family:${f};">Dr. ${escHtml(data.service.doctor)}</td>
            <td align="right" style="padding:14px 12px;font-size:13px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;font-family:${f};">${fmtCurrency(data.billing.subtotal)}</td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  <tr>
    <td align="right" style="padding:16px 24px 8px;">
      <table cellpadding="0" cellspacing="0" role="presentation" style="min-width:220px;">
        <tr>
          <td style="padding:4px 0;font-size:12px;color:#64748b;font-family:${f};">Subtotal</td>
          <td align="right" style="padding:4px 0 4px 24px;font-size:12px;font-weight:500;color:#334155;font-family:${f};">${fmtCurrency(data.billing.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:12px;color:#64748b;font-family:${f};">GST (included)</td>
          <td align="right" style="padding:4px 0 4px 24px;font-size:12px;font-weight:500;color:#334155;font-family:${f};">${fmtCurrency(data.billing.gst)}</td>
        </tr>
        <tr>
          <td style="padding:10px 0 0;border-top:1.5px solid #0891b2;font-size:13px;font-weight:600;color:#0891b2;font-family:${f};">Total payable</td>
          <td align="right" style="padding:10px 0 0 24px;border-top:1.5px solid #0891b2;font-size:16px;font-weight:600;color:#0891b2;font-family:${f};">${fmtCurrency(data.billing.total)}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 24px 16px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0891b2;font-family:${f};">Payment information</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
        <tr>
          <td style="padding:12px 14px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td width="33%" style="vertical-align:top;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#64748b;font-family:${f};">Status</p>
                  <p style="margin:0;font-size:13px;font-weight:500;color:#0f172a;font-family:${f};">${paid ? 'Paid' : 'Pending'}</p>
                </td>
                <td width="33%" style="vertical-align:top;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#64748b;font-family:${f};">Method</p>
                  <p style="margin:0;font-size:12px;font-weight:500;color:#0f172a;font-family:${f};">${escHtml(data.billing.paymentMethod)}</p>
                </td>
                <td width="34%" style="vertical-align:top;">
                  <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#64748b;font-family:${f};">Transaction ID</p>
                  <p style="margin:0;font-size:11px;font-weight:500;color:#0f172a;word-break:break-all;font-family:ui-monospace,Consolas,monospace;">${txn}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:14px 24px 18px;background:#f8fafc;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="vertical-align:top;">
            <p style="margin:0 0 2px;font-size:12px;font-weight:600;color:#64748b;font-family:${f};">${escHtml(data.company.name)}</p>
            <p style="margin:0;font-size:10px;color:#94a3b8;line-height:1.55;font-family:${f};">${escHtml(data.company.address)} · GSTIN ${escHtml(data.company.gstin)}</p>
          </td>
          <td align="right" style="vertical-align:top;">
            <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0891b2;font-family:${f};">Thank you!</p>
            <p style="margin:0;font-size:10px;color:#94a3b8;font-family:${f};">${escHtml(data.company.email)} · ${escHtml(data.company.phone)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
