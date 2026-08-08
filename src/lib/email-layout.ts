/**
 * Shared H2H transactional email shell — Coded Mails HTML structure
 * with Heal to Health brand colors (cyan header, navy CTA/footer).
 */

import { APP_CONFIG } from '@/constants/config';

const BRAND = {
  bg: '#f3f3f5',
  header: '#0891b2',
  text: '#003366',
  tipBg: '#d5d5d5',
  footer: '#043768',
  cta: '#043768',
  ctaSecondary: '#72787e',
  accent: '#0891b2',
  white: '#ffffff',
  divider: '#d5d5d5',
  font: 'Poppins, Helvetica, Arial, sans-serif',
  texture: 'https://www.transparenttextures.com/patterns/brushed-alum.png',
} as const;

const LOGO_URL = `${APP_CONFIG.url.replace(/\/$/, '')}/images/brand/logo-caps.webp`;

export function escapeEmailHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function emailParagraph(text: string): string {
  return `
    <tr>
      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <div style="font-family:${BRAND.font};font-size:20px;font-weight:300;line-height:30px;text-align:left;color:${BRAND.text};">
          <p style="margin:0;">${text}</p>
        </div>
      </td>
    </tr>`;
}

/** Label / value rows (appointment details) — Coded Mails body style */
export function emailDetailsTable(
  rows: Array<{ label: string; value: string }>
): string {
  const trs = rows
    .map(
      (r) => `
      <tr>
        <td style="color:${BRAND.text};font-size:15px;line-height:22px;font-weight:400;word-break:normal;width:40%;padding:8px 0;font-family:${BRAND.font};">${escapeEmailHtml(r.label)}</td>
        <td style="color:${BRAND.text};font-size:15px;line-height:22px;font-weight:500;word-break:normal;text-align:right;padding:8px 0;font-family:${BRAND.font};">${r.value}</td>
      </tr>`
    )
    .join('');

  return `
    <tr>
      <td align="left" class="receipt-table" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:${BRAND.font};font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
          <tr>
            <th colspan="2" style="font-weight:500;color:${BRAND.text};text-align:center;border-bottom:2px solid ${BRAND.divider};font-size:18px;line-height:26px;padding:10px;" align="center">
              Appointment details
            </th>
          </tr>
          ${trs}
        </table>
      </td>
    </tr>`;
}

/**
 * Order / payment summary — matches Coded Mails receipt table
 * (item · qty/meta · amount, then total).
 */
export function emailSummaryTable(opts: {
  title?: string;
  items: Array<{ name: string; meta?: string; amount: string }>;
  totalLabel?: string;
  totalAmount: string;
}): string {
  const title = opts.title || 'Payment summary';
  const itemRows = opts.items
    .map(
      (item) => `
      <tr>
        <td style="color:${BRAND.text};font-size:15px;line-height:22px;font-weight:400;word-break:normal;width:60%;padding-top:10px;font-family:${BRAND.font};">${item.name}</td>
        <td style="color:${BRAND.text};font-size:15px;line-height:22px;font-weight:400;word-break:normal;text-align:right;width:20%;font-family:${BRAND.font};">${item.meta || ''}</td>
        <td style="color:${BRAND.text};font-size:15px;line-height:22px;font-weight:400;word-break:normal;text-align:right;width:20%;font-family:${BRAND.font};">${item.amount}</td>
      </tr>`
    )
    .join('');

  return `
    <tr>
      <td align="left" class="receipt-table" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:${BRAND.font};font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
          <tr>
            <th colspan="3" style="font-weight:500;color:${BRAND.text};text-align:center;border-bottom:2px solid ${BRAND.divider};font-size:18px;line-height:26px;padding:10px;" align="center">
              ${escapeEmailHtml(title)}
            </th>
          </tr>
          ${itemRows}
          <tr>
            <td style="border-bottom:1px solid ${BRAND.divider};padding-top:10px;"></td>
            <td style="border-bottom:1px solid ${BRAND.divider};padding-top:10px;"></td>
            <td style="border-bottom:1px solid ${BRAND.divider};padding-top:10px;"></td>
          </tr>
          <tr>
            <td style="color:${BRAND.text};word-break:normal;font-size:20px;line-height:30px;border-top:1px solid ${BRAND.divider};font-weight:500;padding:10px 0 0 0;text-align:left;font-family:${BRAND.font};" colspan="2" align="left">
              ${escapeEmailHtml(opts.totalLabel || 'Total')}
            </td>
            <td style="color:${BRAND.text};word-break:normal;font-size:20px;line-height:30px;border-top:1px solid ${BRAND.divider};font-weight:500;text-align:right;padding:10px 0 0 0;font-family:${BRAND.font};" align="right">
              ${opts.totalAmount}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

export function emailCodeBlock(code: string): string {
  return `
    <tr>
      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:8px;line-height:1.2;color:${BRAND.header};background:#ecfeff;border:1px solid #a5f3fc;border-radius:8px;display:inline-block;padding:16px 24px;">
          ${escapeEmailHtml(code)}
        </div>
      </td>
    </tr>`;
}

export function emailRawBlock(html: string): string {
  return `
    <tr>
      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        ${html}
      </td>
    </tr>`;
}

function buildCtaButton(
  label: string,
  href: string,
  bgcolor: string,
  align: 'left' | 'center' | 'right' = 'center'
): string {
  return `
    <tr>
      <td align="${align}" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
          <tbody>
            <tr>
              <td align="center" bgcolor="${bgcolor}" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:${bgcolor};" valign="middle">
                <a href="${escapeEmailHtml(href)}" style="display:inline-block;background:${bgcolor};color:white;font-family:${BRAND.font};font-size:18px;font-weight:normal;line-height:30px;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                  ${escapeEmailHtml(label)}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>`;
}

/** Side-by-side CTAs (Coded Mails order / track + receipt) */
export function emailDualCta(opts: {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}): string {
  return `
    <tr>
      <td style="font-size:0px;padding:0;word-break:break-word;">
        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="50%" valign="top"><![endif]-->
        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;max-width:290px;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
            <tbody>
              ${buildCtaButton(opts.primary.label, opts.primary.href, BRAND.cta, 'left')}
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td><td width="50%" valign="top"><![endif]-->
        <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;max-width:290px;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
            <tbody>
              ${buildCtaButton(opts.secondary.label, opts.secondary.href, BRAND.ctaSecondary, 'right')}
            </tbody>
          </table>
        </div>
        <!--[if mso | IE]></td></tr></table><![endif]-->
      </td>
    </tr>`;
}

type EmailCta = { label: string; href: string };

export function wrapH2HEmail(opts: {
  preview: string;
  title?: string;
  /** Optional white title under logo in the cyan header (newsletter-style) */
  headerTitle?: string;
  bodyRowsHtml: string;
  cta?: EmailCta;
  /** Secondary grey button (Coded Mails dual-CTA). Prefer emailDualCta in bodyRowsHtml for layout control. */
  secondaryCta?: EmailCta;
  tip?: string;
}): string {
  const year = new Date().getFullYear();
  const title = opts.title || APP_CONFIG.name;
  const preview = escapeEmailHtml(opts.preview);

  const tip = opts.tip
    ? `
      <div style="background:${BRAND.tipBg};background-color:${BRAND.tipBg};margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.tipBg};background-color:${BRAND.tipBg};width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:${BRAND.font};font-size:14px;font-weight:300;line-height:20px;text-align:left;color:${BRAND.footer};">
                            <p style="margin:0;">${opts.tip}</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>`
    : '';

  let ctaRows = '';
  if (opts.cta && opts.secondaryCta) {
    ctaRows = emailDualCta({ primary: opts.cta, secondary: opts.secondaryCta });
  } else if (opts.cta) {
    ctaRows = buildCtaButton(opts.cta.label, opts.cta.href, BRAND.cta, 'center');
  }

  const headerTitleBlock = opts.headerTitle
    ? `
      <tr>
        <td style="font-size:0px;word-break:break-word;">
          <div style="height:20px;line-height:20px;">&#8202;</div>
        </td>
      </tr>
      <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
          <div style="font-family:${BRAND.font};font-size:24px;font-weight:500;line-height:30px;text-align:center;color:${BRAND.white};">
            <p style="margin:0;">${escapeEmailHtml(opts.headerTitle)}</p>
          </div>
        </td>
      </tr>`
    : '';

  return `<!doctype html>
<html lang="en" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <title>${escapeEmailHtml(title)}</title>
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      #outlook a { padding: 0; }
      body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      p { display: block; margin: 13px 0; }
    </style>
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG />
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix { width: 100% !important; }
      </style>
    <![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" type="text/css" />
    <style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap);</style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width: 480px) {
        .mj-column-per-100 { width: 100% !important; max-width: 100%; }
        .mj-column-per-50 { width: 50% !important; max-width: 50%; }
      }
    </style>
    <style media="screen and (min-width:480px)">
      .moz-text-html .mj-column-per-100 { width: 100% !important; max-width: 100%; }
      .moz-text-html .mj-column-per-50 { width: 50% !important; max-width: 50%; }
    </style>
    <style type="text/css">
      @media only screen and (max-width: 479px) {
        table.mj-full-width-mobile { width: 100% !important; }
        td.mj-full-width-mobile { width: auto !important; }
      }
    </style>
    <style type="text/css">
      a, span, td, th { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }
    </style>
  </head>
  <body style="word-spacing:normal;background-color:${BRAND.bg};">
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preview}</div>

    <div aria-label="${escapeEmailHtml(title)}" aria-roledescription="email" style="background-color:${BRAND.bg};" role="article" lang="en" dir="auto">
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->

      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td style="font-size:0px;word-break:break-word;">
                          <div style="height:20px;line-height:20px;">&#8202;</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:600px;" width="600" bgcolor="${BRAND.header}"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><v:rect style="width:600px;" xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false"><v:fill origin="0.5, 0" position="0.5, 0" src="${BRAND.texture}" color="${BRAND.header}" type="tile" /><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><![endif]-->

      <div style="background:${BRAND.header} url(&quot;${BRAND.texture}&quot;) center top / auto repeat;background-position:center top;background-repeat:repeat;background-size:auto;margin:0px auto;max-width:600px;border-radius:4px 4px 0 0;overflow:hidden;">
        <div style="line-height:0;font-size:0;">
          <table align="center" background="${BRAND.texture}" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.header} url(&quot;${BRAND.texture}&quot;) center top / auto repeat;background-position:center top;background-repeat:repeat;background-size:auto;width:100%;border-collapse:separate;">
            <tbody>
              <tr>
                <td style="border-radius:4px 4px 0 0;direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                  <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                      <tbody>
                        <tr>
                          <td style="vertical-align:top;padding:40px;" align="center">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                              <tbody>
                                <tr>
                                  <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                      <tbody>
                                        <tr>
                                          <td style="width:150px;">
                                            <img alt="${escapeEmailHtml(APP_CONFIG.name)}" src="${LOGO_URL}" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150" height="auto" />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                ${headerTitleBlock}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--[if mso | IE]></v:textbox></v:rect></td></tr></table><![endif]-->

      <div style="background:${BRAND.white};background-color:${BRAND.white};margin:0px auto;max-width:600px;border-radius:0 0 4px 4px;overflow:hidden;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.white};background-color:${BRAND.white};width:100%;border-collapse:separate;">
          <tbody>
            <tr>
              <td style="border-radius:0 0 4px 4px;direction:ltr;font-size:0px;padding:40px 10px;text-align:center;">
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      ${opts.bodyRowsHtml}
                      ${ctaRows}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      ${tip}

      <div style="background:${BRAND.footer};background-color:${BRAND.footer};margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.footer};background-color:${BRAND.footer};width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                    <tbody>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:${BRAND.font};font-size:16px;font-weight:500;line-height:30px;text-align:left;color:${BRAND.white};">
                            <p style="margin:0;">${escapeEmailHtml(APP_CONFIG.name)} · ${escapeEmailHtml(APP_CONFIG.phone)}</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:${BRAND.font};font-size:16px;font-weight:500;line-height:30px;text-align:left;color:${BRAND.white};">
                            <p style="margin:0;">
                              Copyright © ${year} ${escapeEmailHtml(APP_CONFIG.name)}<br />
                              All rights reserved.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:${BRAND.font};font-size:16px;font-weight:500;line-height:30px;text-align:left;color:${BRAND.white};">
                            <a href="${APP_CONFIG.social.instagram}" style="color:${BRAND.accent};text-decoration:none;margin-right:14px;">Instagram</a>
                            <a href="${APP_CONFIG.social.facebook}" style="color:${BRAND.accent};text-decoration:none;margin-right:14px;">Facebook</a>
                            <a href="${APP_CONFIG.social.youtube}" style="color:${BRAND.accent};text-decoration:none;margin-right:14px;">YouTube</a>
                            <a href="${APP_CONFIG.social.linkedin}" style="color:${BRAND.accent};text-decoration:none;">LinkedIn</a>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                          <div style="font-family:${BRAND.font};font-size:16px;font-weight:500;line-height:30px;text-align:left;color:${BRAND.white};">
                            Questions? Write to
                            <a href="mailto:${APP_CONFIG.email}" style="color:#fff;text-decoration:underline;">${escapeEmailHtml(APP_CONFIG.email)}</a>
                            or visit
                            <a href="${APP_CONFIG.url}" style="color:#fff;text-decoration:underline;">healtohealth.in</a>.
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div style="height:1px;line-height:1px;">&#8202;</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </body>
</html>`;
}
