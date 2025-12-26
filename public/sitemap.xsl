<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap - qazuor.com</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          :root {
            --bg: #0f172a;
            --surface: #1e293b;
            --border: #334155;
            --text: #f1f5f9;
            --text-muted: #94a3b8;
            --accent: #3b82f6;
            --accent-hover: #60a5fa;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            padding: 2rem;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          h1 {
            font-size: 1.75rem;
            margin-bottom: 0.5rem;
            color: var(--text);
          }
          .subtitle {
            color: var(--text-muted);
            margin-bottom: 2rem;
          }
          .stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
          }
          .stat {
            background: var(--surface);
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border);
          }
          .stat-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--accent);
          }
          .stat-label {
            font-size: 0.875rem;
            color: var(--text-muted);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: var(--surface);
            border-radius: 0.5rem;
            overflow: hidden;
            border: 1px solid var(--border);
          }
          th, td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border);
          }
          th {
            background: var(--bg);
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          tr:last-child td { border-bottom: none; }
          tr:hover { background: rgba(59, 130, 246, 0.05); }
          a {
            color: var(--accent);
            text-decoration: none;
            word-break: break-all;
          }
          a:hover { color: var(--accent-hover); text-decoration: underline; }
          .priority {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
          .priority-high { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
          .priority-medium { background: rgba(234, 179, 8, 0.2); color: #fbbf24; }
          .priority-low { background: rgba(148, 163, 184, 0.2); color: #94a3b8; }
          .changefreq { color: var(--text-muted); font-size: 0.875rem; }
          @media (max-width: 768px) {
            body { padding: 1rem; }
            th, td { padding: 0.5rem; font-size: 0.875rem; }
            .hide-mobile { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap</h1>
          <p class="subtitle">This sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs for qazuor.com</p>

          <div class="stats">
            <div class="stat">
              <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
              <div class="stat-label">Total URLs</div>
            </div>
            <div class="stat">
              <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[sitemap:priority >= 0.8])"/></div>
              <div class="stat-label">High Priority</div>
            </div>
            <div class="stat">
              <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url[contains(sitemap:loc, '/blog/')])"/></div>
              <div class="stat-label">Blog Pages</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th class="hide-mobile">Priority</th>
                <th class="hide-mobile">Change Freq</th>
                <th class="hide-mobile">Last Modified</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending"/>
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td class="hide-mobile">
                    <xsl:variable name="priority" select="sitemap:priority"/>
                    <span>
                      <xsl:attribute name="class">
                        <xsl:text>priority </xsl:text>
                        <xsl:choose>
                          <xsl:when test="$priority >= 0.8">priority-high</xsl:when>
                          <xsl:when test="$priority >= 0.6">priority-medium</xsl:when>
                          <xsl:otherwise>priority-low</xsl:otherwise>
                        </xsl:choose>
                      </xsl:attribute>
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                  <td class="hide-mobile">
                    <span class="changefreq"><xsl:value-of select="sitemap:changefreq"/></span>
                  </td>
                  <td class="hide-mobile">
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
