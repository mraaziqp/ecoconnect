# NEXUS HUB - FAMILY WEALTH PITCH BUILD ROADMAP

**Goal:** Build 3 critical apps before Family Wealth Studio meeting  
**Timeline:** Complete this week  
**Status:** Ready to build

---

## 🎯 PRIORITY 1: ESTATE VAULT (NEW APP)

### What It Does
Centralized estate planning & inheritance tracking - the single source of truth for wills, trusts, beneficiaries, documents.

### Files to Create/Modify

#### NEW: `src/components/views/EstateVault.tsx`
```typescript
- Document upload & storage
- Beneficiary tracker (who gets what)
- Succession timeline
- Version control on documents
- Access control indicators
```

#### NEW: `src/types/estate.ts`
```typescript
interface EstateDocument {
  id: string;
  type: "will" | "trust" | "insurance" | "property_deed" | "banking";
  title: string;
  uploadedAt: Date;
  fileUrl: string;
  version: number;
  accessLevel: "private" | "spouse" | "advisors" | "family";
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  assets: Array<{ assetName: string; value: number; percentage: number }>;
  inheritance_plan: string;
}

interface SuccessionEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  actionItems: string[];
}
```

#### MODIFY: `src/registry.ts`
Add Estate Vault to the app registry:
```typescript
{
  id: "estate-vault",
  name: "Estate Vault",
  category: "core",
  logo: "Briefcase",
  shortDesc: "Wills, trusts, beneficiaries, inheritance planning",
  fullDesc: "Single source of truth for estate planning. Centralize documents, track beneficiaries, plan succession.",
  status: "ACTIVE",
  launchCount: 0,
  color: "from-blue-600 to-purple-600"
}
```

---

## 🎯 PRIORITY 2: ADVISOR DASHBOARD (NEW APP)

### What It Does
Professional workspace for advisors to manage multiple family offices, generate reports, track compliance.

### Files to Create

#### NEW: `src/components/views/AdvisorDashboard.tsx`
```typescript
- Multi-client list view
- Portfolio summary by client (aggregate holdings)
- Performance metrics per client
- 1-click report generation ← THIS IS THE DEMO HERO
- Compliance checklist
- Action items for follow-ups
```

#### NEW: `src/components/AdvisorReportGenerator.tsx`
```typescript
- Generates PDF report in real-time
- Shows portfolio summary, performance, allocations
- Client-facing professional format
- Includes tax insights
```

#### MODIFY: `src/registry.ts`
```typescript
{
  id: "advisor-dashboard",
  name: "Advisor Dashboard",
  category: "core",
  logo: "BarChart3",
  shortDesc: "Multi-client management, reporting, compliance",
  fullDesc: "Professional advisor workspace. Manage all clients, generate reports in 30 seconds, track compliance.",
  status: "ACTIVE",
  launchCount: 0,
  color: "from-emerald-600 to-teal-600"
}
```

---

## 🎯 PRIORITY 3: ENHANCED FINANCEPLAY

### What It Does
Real-time multi-account portfolio tracking with AI insights.

### Files to Modify

#### MODIFY: `src/components/views/FinancePlay.tsx`
Add:
```typescript
- Multi-account aggregation (show all accounts in one view)
- Portfolio allocation pie chart
- Asset class breakdown (stocks, bonds, property, cash)
- Performance vs market comparison
- AI-powered insights (yield analysis, recommendations)
- Export to PDF button
```

#### NEW: `src/components/PortfolioVisualization.tsx`
```typescript
- Pie chart of asset allocation
- Bar chart of performance vs market
- Account breakdown table
- Real-time sync indicators
```

---

## 📋 BUILD ORDER (This Week)

### Day 1: Core Structure
- [ ] Create Estate Vault component (basic structure)
- [ ] Create Advisor Dashboard component (basic structure)
- [ ] Add both to registry
- [ ] Verify they appear in app grid

### Day 2: Estate Vault Features
- [ ] Document upload UI
- [ ] Beneficiary tracker
- [ ] Succession timeline
- [ ] Version control display

### Day 3: Advisor Dashboard Features
- [ ] Multi-client list view
- [ ] Portfolio aggregation logic
- [ ] Report generator (THIS IS KEY - must work smoothly)
- [ ] Compliance checklist UI

### Day 4: FinancePlay Enhancements
- [ ] Multi-account aggregation
- [ ] Portfolio visualization (charts)
- [ ] Market comparison
- [ ] Export to PDF

### Day 5: Polish & Testing
- [ ] Style all components with glassmorphism
- [ ] Test all interactive features
- [ ] Test report generation
- [ ] Test profile switching (role-based access)

---

## 🔑 CRITICAL SUCCESS FACTORS

### Estate Vault MUST:
✅ Show document list  
✅ Allow uploads (UI only - can fake backend for demo)  
✅ Show beneficiaries clearly  
✅ Show "access control" badges  

### Advisor Dashboard MUST:
✅ Show multiple clients in a list  
✅ Click one client → see their portfolio  
✅ **CLICK "GENERATE REPORT" → PDF downloads instantly** ← DEMO HERO  
✅ Show compliance checklist  

### FinancePlay Enhancements MUST:
✅ Show total portfolio value  
✅ Show asset allocation pie chart  
✅ Show performance vs market  
✅ Export button works  

---

## 💻 SAMPLE CODE STRUCTURE

### Estate Vault - Basic Component
```typescript
// src/components/views/EstateVault.tsx
import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';

export const EstateVault: React.FC = () => {
  const [documents, setDocuments] = useState([
    {
      id: '1',
      type: 'will',
      title: "Raj's Will - 2024 Update",
      uploadedAt: new Date('2024-01-15'),
      version: 3,
      accessLevel: 'family'
    },
    // ... more docs
  ]);

  const [beneficiaries] = useState([
    {
      id: '1',
      name: 'Priya Patel',
      relationship: 'Spouse',
      assets: [{ assetName: 'Portfolio', value: 2500000, percentage: 48 }]
    },
    // ... more beneficiaries
  ]);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Estate Documents</h2>
        <div className="grid gap-3">
          {documents.map(doc => (
            <div key={doc.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{doc.title}</h3>
                  <p className="text-xs text-slate-400">v{doc.version}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  {doc.accessLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Beneficiaries</h2>
        <div className="space-y-3">
          {beneficiaries.map(b => (
            <div key={b.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <h3 className="font-semibold text-white">{b.name}</h3>
              <p className="text-sm text-slate-400">{b.relationship}</p>
              {b.assets.map((asset, idx) => (
                <p key={idx} className="text-sm text-cyan-300 mt-2">
                  {asset.assetName}: R{asset.value.toLocaleString()} ({asset.percentage}%)
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
```

### Advisor Dashboard - Report Generation
```typescript
// src/components/AdvisorReportGenerator.tsx
const generateReport = async (clientId: string) => {
  // Simple implementation for demo
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Client Portfolio Report', 10, 10);
  doc.setFontSize(12);
  doc.text(`Portfolio Value: R5.2M`, 10, 30);
  doc.text(`Performance (YTD): +8.4%`, 10, 50);
  doc.text(`Market Benchmark: +6.2%`, 10, 70);
  
  // Save as PDF
  doc.save(`Client_Report_${clientId}.pdf`);
};
```

---

## ✅ DEFINITION OF DONE

For each component, you're done when:

- [ ] Component renders without errors
- [ ] Has realistic sample data
- [ ] Shows in app grid and launches from shell
- [ ] Displays with glassmorphism styling
- [ ] All interactive elements work (clicks, buttons)
- [ ] Looks professional (not placeholder)
- [ ] Ready to demo to Family Wealth Studio

---

## 📱 DEMO CHECKLIST

Before the meeting:

- [ ] Estate Vault: Shows documents, beneficiaries, timeline
- [ ] Advisor Dashboard: Lists clients, shows portfolio, generates report with 1 click
- [ ] FinancePlay: Shows portfolio pie chart, market comparison, export works
- [ ] All apps available when logged in
- [ ] Profile switching works (same app, different data based on role)
- [ ] No console errors
- [ ] Responsive on laptop screen

---

## 🚀 START HERE

### Step 1: Create Estate Vault Component
```bash
# Create the file: src/components/views/EstateVault.tsx
# Copy the sample code above
# Add to src/registry.ts
# Test it loads
```

### Step 2: Create Advisor Dashboard Component
```bash
# Create the file: src/components/views/AdvisorDashboard.tsx
# Include report generator
# Add to src/registry.ts
# Test report generation
```

### Step 3: Enhance FinancePlay
```bash
# Modify: src/components/views/FinancePlay.tsx
# Add charts and export
# Test export functionality
```

### Step 4: Polish & Deploy
```bash
# Run full test
# Commit all changes
# Deploy to Vercel
# Test live environment
```

---

**Next:** Start building Estate Vault component. Message me when you hit a blocker.

