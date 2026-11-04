import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Vulnerability Assessment: CVEs, CVSS, Misconfigurations & Validation',
  description: 'Comprehensive, interactive educational platform to learn vulnerability assessments, CVE research, CVSS severity evaluation, security misconfiguration remediation, and scanner findings validation.',
  keywords: ['Vulnerability Assessment', 'CVE', 'CVSS v3.1', 'CVSS v4.0', 'Security Misconfiguration', 'Vulnerability Validation', 'OWASP Juice Shop', 'Nmap', 'ZAP', 'OpenVAS'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#FF1A2A]/40 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
