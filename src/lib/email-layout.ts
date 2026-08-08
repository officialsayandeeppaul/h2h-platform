/**
 * Shared H2H transactional email shell — Coded Mails structure
 * with Heal to Health brand colors (cyan header, navy CTA/footer).
 */

import { APP_CONFIG } from '@/constants/config';

const BRAND = {
  bg: '#f3f3f5',
  header: '#0891b2',
  text: '#0c4a6e',
  mutedTip: '#e2e8f0',
  footer: '#0e4c68',
  cta: '#0e4c68',
  white: '#ffffff',
  font: "Poppins, Helvetica, Arial, sans-serif",
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
        <div style="font-family:${BRAND.font};font-size:18px;font-weight:300;line-height:28px;text-align:left;color:${BRAND.text};">
          <p style="margin:0;">${text}</p>
        </div>
      </td>
    </tr>`;
}

export function emailDetailsTable(
  rows: Array<{ label: string; value: string }>
): string {
  const trs = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 0;font-size:15px;color:#64748b;width:38%;font-family:${BRAND.font};">${escapeEmailHtml(r.label)}</td>
        <td style="padding:8px 0;font-size:15px;color:${BRAND.text};font-weight:500;font-family:${BRAND.font};">${r.value}</td>
      </tr>`
    )
    .join('');

  return `
    <tr>
      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
          <tr>
            <td style="padding:18px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${trs}</table>
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
        <div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:8px;line-height:1.2;color:${BRAND.header};background:#ecfeff;border-radius:10px;display:inline-block;padding:16px 24px;">
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

type EmailCta = { label: string; href: string };

export function wrapH2HEmail(opts: {
  preview: string;
  title?: string;
  bodyRowsHtml: string;
  cta?: EmailCta;
  tip?: string;
}): string {
  const year = new Date().getFullYear();
  const title = opts.title || APP_CONFIG.name;
  const preview = escapeEmailHtml(opts.preview);
  const tip = opts.tip
    ? `
      <div style="background:${BRAND.mutedTip};background-color:${BRAND.mutedTip};margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.mutedTip};background-color:${BRAND.mutedTip};width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
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

  const ctaRow = opts.cta
    ? `
      <tr>
        <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
            <tbody>
              <tr>
                <td align="center" bgcolor="${BRAND.cta}" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:${BRAND.cta};" valign="middle">
                  <a href="${escapeEmailHtml(opts.cta.href)}" style="display:inline-block;background:${BRAND.cta};color:white;font-family:${BRAND.font};font-size:18px;font-weight:normal;line-height:30px;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">
                    ${escapeEmailHtml(opts.cta.label)}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
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
      <noscript><xml><o:OfficeDocumentSettings><o:AllowPNG /><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <![endif]-->
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" type="text/css" />
    <style type="text/css">@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap);</style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width: 480px) {
        .mj-column-per-100 { width: 100% !important; max-width: 100%; }
      }
    </style>
    <style type="text/css">
      a, span, td, th { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }
    </style>
  </head>
  <body style="word-spacing:normal;background-color:${BRAND.bg};">
    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preview}</div>
    <div aria-label="${escapeEmailHtml(title)}" aria-roledescription="email" style="background-color:${BRAND.bg};" role="article" lang="en" dir="auto">
      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
            <div style="height:20px;line-height:20px;">&#8202;</div>
          </td></tr></tbody>
        </table>
      </div>

      <div style="background:${BRAND.header};margin:0px auto;max-width:600px;border-radius:4px 4px 0 0;overflow:hidden;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.header};width:100%;border-collapse:separate;">
          <tbody>
            <tr>
              <td style="border-radius:4px 4px 0 0;direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td style="vertical-align:top;padding:32px 40px;" align="center">
                        <img alt="${escapeEmailHtml(APP_CONFIG.name)}" src="${LOGO_URL}" width="150" height="auto" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:150px;max-width:100%;margin:0 auto;" />
                        <div style="font-family:${BRAND.font};font-size:13px;font-weight:400;line-height:20px;color:${BRAND.white};opacity:0.92;margin-top:12px;">
                          ${escapeEmailHtml(APP_CONFIG.tagline)}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background:${BRAND.white};background-color:${BRAND.white};margin:0px auto;max-width:600px;border-radius:0 0 4px 4px;overflow:hidden;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.white};background-color:${BRAND.white};width:100%;border-collapse:separate;">
          <tbody>
            <tr>
              <td style="border-radius:0 0 4px 4px;direction:ltr;font-size:0px;padding:40px 10px;text-align:center;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    ${opts.bodyRowsHtml}
                    ${ctaRow}
                  </tbody>
                </table>
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
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                  <tbody>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:${BRAND.font};font-size:15px;font-weight:500;line-height:26px;text-align:left;color:${BRAND.white};">
                          <p style="margin:0;">${escapeEmailHtml(APP_CONFIG.name)} · ${escapeEmailHtml(APP_CONFIG.phone)}</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:${BRAND.font};font-size:14px;font-weight:400;line-height:24px;text-align:left;color:${BRAND.white};">
                          <p style="margin:0;">
                            <a href="mailto:${APP_CONFIG.email}" style="color:#fff;text-decoration:underline;">${escapeEmailHtml(APP_CONFIG.email)}</a>
                            &nbsp;·&nbsp;
                            <a href="${APP_CONFIG.url}" style="color:#fff;text-decoration:underline;">healtohealth.in</a>
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:${BRAND.font};font-size:14px;font-weight:500;line-height:24px;text-align:left;color:${BRAND.white};">
                          <p style="margin:0;">Copyright © ${year} ${escapeEmailHtml(APP_CONFIG.name)}<br />All rights reserved.</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                        <div style="font-family:${BRAND.font};font-size:14px;font-weight:400;line-height:24px;text-align:left;color:${BRAND.white};">
                          <a href="${APP_CONFIG.social.instagram}" style="color:#fff;text-decoration:underline;margin-right:12px;">Instagram</a>
                          <a href="${APP_CONFIG.social.facebook}" style="color:#fff;text-decoration:underline;margin-right:12px;">Facebook</a>
                          <a href="${APP_CONFIG.social.youtube}" style="color:#fff;text-decoration:underline;margin-right:12px;">YouTube</a>
                          <a href="${APP_CONFIG.social.linkedin}" style="color:#fff;text-decoration:underline;">LinkedIn</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin:0px auto;max-width:600px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
          <tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
            <div style="height:1px;line-height:1px;">&#8202;</div>
          </td></tr></tbody>
        </table>
      </div>
    </div>
  </body>
</html>`;
}
