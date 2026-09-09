# GEO & AI Search Readiness Report for MoneyMinded

**Date:** 2026-09-09  
**URL:** https://moneymindedguide.com  
**Overall GEO Readiness Score:** 63/100

## 1. AI Crawler Accessibility

| Crawler | Status | Notes |
|---------|--------|-------|
| GPTBot (OpenAI) | ✅ Allowed | `robots.txt` allows all user-agents |
| OAI-SearchBot (OpenAI) | ✅ Allowed | |
| ClaudeBot (Anthropic) | ✅ Allowed | |
| PerplexityBot (Perplexity) | ✅ Allowed | |
| CCBot (Common Crawl) | ✅ Allowed | May want to block if training data is not desired |
| Google-Extended (Google) | ✅ Allowed | |
| Bytespider (ByteDance) | ✅ Allowed | |
| anthropic-ai (Anthropic) | ✅ Allowed | |

**robots.txt:** Minimal but permissive (`User-agent: * Allow: /`). Allows all AI crawlers, which is good for AI search visibility. No blocks detected.

**RSL 1.0 (Really Simple Licensing):** ❌ Not implemented. No machine-readable AI licensing terms found.

## 2. llms.txt Status

**Status:** ❌ Missing (404)

- No `/llms.txt` file found at root.
- **Impact:** Google Search ignores `llms.txt` per official guidance. However, non-Google AI systems (ChatGPT, Perplexity) may use it for content guidance. Optional but recommended for non-Google AI visibility.
- **Recommendation:** Create a structured `llms.txt` with site description, key pages, and contact information to help AI crawlers understand site structure.

## 3. Content Citability Assessment

**Score:** 7/10

**Strong signals:**
- Clear, quotable definitions (e.g., "A budget is simply a plan for the money you earn")
- Self-contained FAQ answers (each 50-100 words)
- Step-by-step structure with numbered steps
- Specific advice with actionable details (50/30/20 rule, zero-based budgeting)
- Sources cited (CFPB, MoneyHelper, GOV.UK)

**Weak signals:**
- Some passages are opinion-based without specific data
- No unique statistics or original research
- Generic source attribution ("we drew on official government and regulatory resources")

**Optimal passage length:** Article contains several 134-167 word blocks suitable for AI citation, particularly in FAQ and step-by-step sections.

## 4. Brand Mention Signals

**Score:** 3/10

| Platform | Presence | Notes |
|----------|----------|-------|
| Wikipedia | ❌ None | Not mentioned in relevant Wikipedia articles |
| Reddit | ❌ None | No mentions found |
| YouTube | ❌ None | No channel or mentions found |
| LinkedIn | ⚠️ Confusion | "MoneyMinded" brand is taken by ANZ's financial education program and a UK company |
| Domain authority | ⚠️ Low | New site (2026), limited backlinks |

**Critical issue:** Brand name "MoneyMinded" conflicts with established ANZ program (since 2002) with 1.1M+ users. This creates entity confusion for AI systems.

## 5. Passage-Level Content Structure

**Score:** 9/10

**Strong signals:**
- Clean H1→H2→H3 hierarchy
- Question-based headings ("Why a budget actually helps", "What is the best budgeting method for beginners?")
- Short paragraphs (2-4 sentences)
- Tables for comparative data (budgeting methods)
- Ordered/unordered lists for step-by-step content
- FAQ section with clear Q&A format
- Table of contents for navigation

**Weak signals:**
- No inline definitions using "X is..." pattern in main content (only in FAQ)

## 6. Structured Data

**Score:** 8/10

**Present:**
- Organization schema (homepage)
- WebSite schema (homepage)
- Article schema (with author, dates, publisher)
- BreadcrumbList schema
- FAQPage schema (with 5 questions)

**Missing:**
- Person schema for author (only referenced in Article schema)
- HowTo schema for step-by-step guide
- Speakable schema for voice search
- Video schema (no video content)

## 7. Factual Accuracy Signals & Source Attribution

**Score:** 6/10

**Strong signals:**
- Author byline with credentials ("Founder & Editor")
- Publication and last-updated dates
- Disclaimer about general education vs. personalized advice
- Editorial standards page referenced

**Weak signals:**
- Generic source attribution without specific citations to claims
- No inline links to primary sources within content
- No fact-checking badges or verification signals
- No expert review quotes with attribution

## 8. Multi-Modal Content

**Score:** 2/10

- ❌ No images in articles
- ❌ No infographics or charts
- ❌ No video content
- ❌ No interactive elements within articles (calculators are separate pages)
- ✅ Calculators exist as separate tools (not embedded)

## 9. Platform-Specific Scores

| Platform | Score | Reasoning |
|----------|-------|-----------|
| Google AI Overviews | 70/100 | Well-structured content, good schema, but low brand authority |
| Google AI Mode | 60/100 | Freshness is good, but limited entity authority and brand mentions |
| ChatGPT | 50/100 | Low brand presence, no Wikipedia/Reddit mentions |
| Perplexity | 55/100 | Citable content but weak community validation signals |

## 10. Top 5 Highest-Impact Changes

### Critical (Immediate)
1. **Differentiate brand identity** - Add "MoneyMinded Guide" or similar qualifier to avoid confusion with ANZ's MoneyMinded program. Create unique brand entity.

### High Priority
2. **Add images and visual content** - Include at least one relevant image per article, create infographics for budgeting methods.
3. **Strengthen source attribution** - Add inline citations to specific claims with links to primary sources.
4. **Build brand presence** - Create YouTube channel, Reddit profile, LinkedIn company page.

### Medium Priority
5. **Create llms.txt** - Add structured file with site description and key page highlights.

## 11. Schema Recommendations

**Add:**
- `Person` schema for author with `sameAs` links to social profiles
- `HowTo` schema for step-by-step guides
- `VideoObject` if adding video content
- `Speakable` schema for voice search optimization

## 12. Content Reformatting Suggestions

1. **Add "What is a budget?" definition** in first 60 words of budget article
2. **Create self-contained answer blocks** of 134-167 words for key concepts
3. **Add specific statistics** with sources (e.g., "According to CFPB, X% of Americans...")
4. **Include comparison tables** with data points for all articles
5. **Add author credentials** with links to professional profiles

## Summary

MoneyMinded has strong technical foundations (server-side rendering, proper schema, permissive robots.txt) and excellent content structure. The primary weaknesses are low brand authority, minimal multi-modal content, and generic source attribution. The brand name conflict with ANZ's established program creates significant entity confusion that should be addressed immediately. Content citability is good but could be enhanced with more specific data and inline sourcing.

**Quick Wins (1-2 hours):**
- Add images to top 5 articles
- Strengthen first paragraphs with definitions
- Add inline source citations

**Medium Effort (1-2 days):**
- Create llms.txt
- Build social media presence
- Add author credentials and bios

**High Impact (1-2 weeks):**
- Develop unique research/data
- Create YouTube channel
- Build Wikipedia presence for brand