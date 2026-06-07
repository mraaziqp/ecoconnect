# Nexus Hub - Comprehensive Testing Guide

## Quick Start Testing

### 1. **Phase 1: Professional Polish Testing**

#### Onboarding Flow
- [ ] Open app in incognito window (fresh user)
- [ ] Verify 5-step onboarding appears
- [ ] Step through all 5 screens: Welcome, Profiles, Marketplace, Secondbrain, Vault
- [ ] Verify "Get Started" button completes onboarding
- [ ] Verify localStorage persists onboarding state (refresh = no onboarding)

#### Settings Panel
- [ ] Click settings ⚙️ icon in topbar
- [ ] Verify panel slides in from right
- [ ] Toggle "Theme" options
- [ ] Toggle "System Notifications" switch
- [ ] Toggle "Auto Update Apps" switch
- [ ] Verify "About" section shows v2.0.0
- [ ] Click outside to close

#### Error Boundary
- [ ] Open browser console
- [ ] Throw test error: `throw new Error("test")`
- [ ] Verify graceful error page appears
- [ ] Click "Reload Application" button
- [ ] Verify app reloads successfully

#### Empty States
- [ ] Navigate to FinancePlay app
- [ ] Verify "No Transactions Yet" empty state appears
- [ ] Add a transaction
- [ ] Verify empty state disappears

### 2. **Phase 2: Secondbrain AI Testing**

#### AI Spotlight Search
- [ ] Press **⌘K** (Mac) or **Ctrl+K** (Windows)
- [ ] Type: "track my finances"
- [ ] Verify search results show up with relevance scores
- [ ] Type: "relationship milestones"
- [ ] Verify ProjectCupid appears in results
- [ ] Test navigation with arrow keys
- [ ] Press Enter to select app
- [ ] Verify selected app launches

#### Real Chat (if GEMINI_API_KEY configured)
- [ ] Click center Spotlight button
- [ ] Type: "What apps are available?"
- [ ] Verify AI responds with ecosystem description
- [ ] Follow up: "How do I track my relationship?"
- [ ] Verify context-aware response

#### Fallback Mode (no API key)
- [ ] Unset GEMINI_API_KEY
- [ ] Restart dev server
- [ ] Test chat
- [ ] Verify fallback message about API key setup

### 3. **Phase 3: Production Deployment Testing**

#### Build
```bash
npm run build
# ✓ Verify dist folder created
# ✓ Verify no TypeScript errors
# ✓ Verify size < 500KB (gzipped)
```

#### Docker Build
```bash
docker build -t nexus-hub:latest .
# ✓ Verify build completes without errors
```

#### Docker Run
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=$GEMINI_API_KEY \
  nexus-hub:latest
# ✓ Visit http://localhost:3000
# ✓ Verify app loads and functions normally
```

#### Docker Compose
```bash
docker-compose up
# ✓ Verify container starts
# ✓ Verify health check passes
# ✓ Test all features in container
```

### 4. **Phase 4: App Feature Testing**

#### FinancePlay
- [ ] Add transaction with $500 income
- [ ] Add transaction with $200 expense
- [ ] Verify ledger updates
- [ ] Check analytics:
  - [ ] Income shows $500
  - [ ] Expenses shows $200
  - [ ] Net Balance shows $300
  - [ ] Expense Ratio shows ~40%
  - [ ] Health Score shows "Excellent"

#### ProjectCupid
- [ ] Add date: "Anniversary Dinner" with rating 95
- [ ] Add date: "Coffee Date" with rating 88
- [ ] Verify metrics:
  - [ ] Average rating calculates correctly
  - [ ] Sync rating updates
  - [ ] Connection quality displays
  - [ ] Trend shows improvement

#### OpsNexus
- [ ] Verify all nodes display
- [ ] Check system health score
- [ ] Verify load percentages
- [ ] Monitor status indicators

### 5. **Performance Testing**

#### Load Time
```bash
# Measure Time to Interactive (TTI)
# Target: < 2 seconds on broadband
# Acceptable: < 3 seconds on 4G
```

#### Lighthouse
```bash
# Run in Chrome DevTools
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
# Performance: > 85 (may be lower on dev)
```

#### Memory Leaks
- [ ] Open DevTools Memory tab
- [ ] Take heap snapshot
- [ ] Use app for 5 minutes
- [ ] Switch apps 20 times
- [ ] Take another snapshot
- [ ] Compare - should be no significant growth

### 6. **Cross-Browser Testing**

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**Checklist:**
- [ ] All buttons clickable
- [ ] Smooth animations
- [ ] Forms work correctly
- [ ] Responsive layout adapts
- [ ] No console errors

### 7. **Accessibility Testing**

- [ ] Tab navigation works
- [ ] Keyboard shortcuts functional (⌘K, Esc)
- [ ] Screen reader compatible (test with NVDA/JAWS)
- [ ] Color contrast meets WCAG AA standard
- [ ] Focus states visible

### 8. **Security Testing**

- [ ] No sensitive data in console logs
- [ ] API keys not exposed in DOM
- [ ] CORS headers correct
- [ ] No XSS vulnerabilities
- [ ] Input validation works

## Testing Checklist

```
Phase 1: Professional Polish
[ ] Onboarding completes
[ ] Settings panel works
[ ] Error boundary catches crashes
[ ] Empty states display correctly

Phase 2: Secondbrain AI
[ ] ⌘K spotlight opens
[ ] Search returns relevant results
[ ] Chat responds (with API key)
[ ] Fallback works (without API key)

Phase 3: Production
[ ] Build succeeds
[ ] Docker builds
[ ] Docker runs successfully
[ ] All features work in container

Phase 4: Apps
[ ] FinancePlay analytics accurate
[ ] ProjectCupid metrics calculate
[ ] OpsNexus displays nodes
[ ] All transitions smooth

Performance
[ ] TTI < 2s
[ ] Lighthouse > 85
[ ] No memory leaks
[ ] Smooth 60fps animations

Security
[ ] No secrets exposed
[ ] Input validation works
[ ] CORS configured
[ ] No XSS vulnerabilities
```

## Deep Testing Process

### 1. **Functional Testing**
Each feature tested end-to-end:
- Input → Processing → Output verification

### 2. **Integration Testing**
Cross-feature workflows:
- Profile switch → App loads with correct permissions
- Search → App launches
- Chat → Respects active context

### 3. **Performance Testing**
Measure:
- Load times
- Memory usage
- CPU usage
- Animation frame rate

### 4. **Regression Testing**
Verify:
- No existing features broken
- No performance degradation
- UI consistent across views

## Test Results Template

```
Date: 2026-06-06
Environment: Chrome 125 / Ubuntu 24.04
Build: Production

PHASE 1 ✓✓✓
- Onboarding: PASS
- Settings: PASS  
- Error Boundary: PASS
- Empty States: PASS

PHASE 2 ✓✓✓
- AI Spotlight: PASS
- Chat: PASS
- Search: PASS
- Context Awareness: PASS

PHASE 3 ✓✓
- Build: PASS
- Docker: PASS
- Deployment: PASS

PHASE 4 ✓✓✓
- FinancePlay: PASS
- ProjectCupid: PASS
- OpsNexus: PASS

Performance:
- TTI: 1.8s ✓
- Lighthouse: 92 ✓
- Memory Stable ✓

Security: PASS ✓

Overall: RELEASE READY ✓
```

## Continuous Testing

Run before each commit:
```bash
npm run lint        # TypeScript check
npm run build       # Production build
```

Run before each PR:
```bash
# All manual tests above
# + Browser compatibility
# + Performance audit
```

Run before production deploy:
```bash
# All tests above
# + Load testing
# + Security scan
# + Staging verification
```
