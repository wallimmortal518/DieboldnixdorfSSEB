export interface Provocation {
  number: string;
  title: string;
  hook: string;
  body: string;
  stat: string;
  statLabel: string;
  bullets: string[];
  cta: string;
}

export interface GrocerData {
  id: string;
  name: string;
  shortName: string;
  customerTerm: string;
  tagline: string;
  description: string;
  accentColor: string;
  heroHeadline: string;
  heroSubheadline: string;
  contextStat: { value: string; label: string }[];
  provocations: Provocation[];
}

// ─── SHARED BENCHMARK STATS ──────────────────────────────────────────────────
// Source: Self-Service Excellence Benchmark, Incisiv × Diebold Nixdorf, 2025
// 131 retail executives · 2,533 shoppers · June–July 2025

export const GROCERS: GrocerData[] = [
  // ─── 1. WALMART ────────────────────────────────────────────────────────────
  {
    id: "walmart",
    name: "Walmart Inc.",
    shortName: "Walmart",
    customerTerm: "customers",
    tagline: "Save Money. Live Better.",
    description:
      "The world's largest retailer with 4,700+ U.S. stores — where scale is both the opportunity and the operational mandate.",
    accentColor: "#0071CE",
    heroHeadline: "At Walmart Scale, Execution Gaps Aren't Percentages — They're Millions of Transactions",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how the industry's top operators are widening their lead. Here's what it means for Walmart.",
    contextStat: [
      { value: "4,700+", label: "U.S. store locations" },
      { value: "80%", label: "of execs prioritize SCO as top-3 strategy" },
      { value: "$0.10+", label: "revenue impact per transaction second saved" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "80% of retailers call SCO a top priority. Only 14% have the execution to prove it.",
        body: "Stating intent is easy. At Walmart's scale — 4,700+ stores, multiple formats, millions of daily transactions — the gap between strategic priority and store-level execution compounds fast. Leaders don't spend more. They execute more systematically.",
        stat: "14%",
        statLabel: "reached best-in-class SCO maturity",
        bullets: [
          "Supercenters, Neighborhood Markets, and Sam's Club require distinct execution playbooks",
          "Inconsistent associate empowerment creates variable experiences across markets",
          "Top performers use 30-day rollout benchmarks and intervention rate monitoring",
        ],
        cta: "See where Walmart ranks on execution maturity",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Walmart's shoppers have trained themselves to use SCO less than the business needs.",
        body: "Customers limit basket sizes to match system limitations — not their actual shopping needs. For Walmart, where EDLP economics depend on throughput, this behavioral adaptation quietly suppresses revenue per square foot.",
        stat: "65%",
        statLabel: "of SCO trips use 10 items or fewer",
        bullets: [
          "Large mixed-basket trips migrate to staffed lanes, raising labor cost",
          "55+ shoppers need 38% more assistance — a high-volume segment for Walmart",
          "Leaders removing basket-size friction see 22% higher SCO transaction values",
        ],
        cta: "Benchmark Walmart's shopper experience performance",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Walmart is building the future of checkout while the present breaks down for 65% of shoppers.",
        body: "Scanner failures and product identification issues remain the #1 delay driver — far ahead of biometric checkout failures that attract industry attention. At Walmart's transaction volume, fixing foundational reliability delivers ROI no innovation launch can match.",
        stat: "65%",
        statLabel: "cite scanner issues as their top delay",
        bullets: [
          "Scanner reliability gains multiply across hundreds of millions of weekly transactions",
          "51% of shoppers want auto product ID — only 15% of retailers have deployed it",
          "Fixing the top 5 friction points first yields 41% ROI vs. 12% for innovation-first",
        ],
        cta: "Audit Walmart's technology investment alignment",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Walmart+ has the potential to be the most powerful loyalty-SCO integration in retail.",
        body: "Only 38% of retailers are highly satisfied with their SCO system integration. For Walmart, weak integration doesn't just create checkout friction — it undermines the Walmart+ value proposition at the moment that matters most.",
        stat: "38%",
        statLabel: "satisfied with current SCO tech integration",
        bullets: [
          "Walmart+ benefits must surface seamlessly at SCO without friction steps",
          "Real-time inventory accuracy reduces 'item not found' interventions mid-transaction",
          "Platform leaders achieving 95% uptime are built on integration-first architecture",
        ],
        cta: "Evaluate Walmart's integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Walmart has one of retail's most advanced data operations. SCO measurement hasn't caught up.",
        body: "75% of retailers track SCO KPIs — but only 25% trust the data enough to act on it. Decisions made at Walmart headquarters cascade across thousands of stores. Incomplete SCO data means enormous misallocated investment.",
        stat: "25%",
        statLabel: "have high confidence in their SCO data",
        bullets: [
          "60% cite shrink as the #1 SCO challenge, yet only 31% track it distinctly from POS",
          "Supercenter and Neighborhood Market benchmarks cannot be the same metric",
          "Leaders tie SCO metrics directly to loyalty rate, basket size, and labor productivity",
        ],
        cta: "Assess Walmart's measurement confidence",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "The next 18 months will determine which SCO category Walmart competes in for a decade.",
        body: "Platform Builders (15% of retailers) achieve 92% customer satisfaction. Feature Deployers (70%) reach 76%. Transformation Resisters trail at 58%. The gap is widening. At Walmart's scale, the compounding effect of the wrong category is enormous.",
        stat: "92% vs. 58%",
        statLabel: "satisfaction gap between leaders and laggards",
        bullets: [
          "Platform builders achieve 95% uptime vs. 65% for resisters",
          "41% ROI for platform builders vs. 12% for laggards",
          "Catch-up costs increase every quarter — early leaders compound their advantage",
        ],
        cta: "Identify which archetype Walmart is building toward",
      },
    ],
  },

  // ─── 2. KROGER ─────────────────────────────────────────────────────────────
  {
    id: "kroger",
    name: "The Kroger Co.",
    shortName: "Kroger",
    customerTerm: "customers",
    tagline: "Fresh for Everyone",
    description:
      "America's leading traditional supermarket chain with 2,700+ stores across diverse regional banners — where fresh quality and customer loyalty define the brand.",
    accentColor: "#1A5EB8",
    heroHeadline: "Kroger's Self-Service Moment: When Fresh Promise Meets Friction Reality",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how the industry's top operators are separating from the pack. Here's what the data means for Kroger.",
    contextStat: [
      { value: "2,700+", label: "stores across regional banners" },
      { value: "80%", label: "of execs rank SCO as a top-3 priority" },
      { value: "10%", label: "CAGR in SCO transaction share projected" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "Kroger's SCO strategy is clear. The benchmark shows how many competitors say the same thing.",
        body: "With banners from Harris Teeter to King Soopers to Fred Meyer, Kroger's execution challenge is multi-dimensional. Only 14% of retailers reach best-in-class maturity — those who get there first in Kroger's markets lock in an advantage that's hard to displace.",
        stat: "36%",
        statLabel: "of retailers stuck at average SCO maturity",
        bullets: [
          "Harris Teeter premium shoppers need different SCO calibration than King Soopers value trips",
          "40% of SCO interventions are triggered by weighted items — empowerment frameworks reduce escalations",
          "Kroger Plus loyalty perception is shaped at SCO more than anywhere else in the store",
        ],
        cta: "See how Kroger's execution compares to benchmark leaders",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "'Fresh for Everyone' breaks down exactly where fresh shopping meets self-checkout.",
        body: "Weighted items trigger staff intervention in 40% of transactions. Produce and deli are the top friction sources. For Kroger, where fresh is the core brand differentiator, the SCO lane is actively contradicting the brand promise.",
        stat: "40%",
        statLabel: "of complex-item transactions need staff intervention",
        bullets: [
          "Fresh assortment depth — deli, bakery, floral — creates disproportionate SCO friction",
          "35–54 shoppers (Kroger's core) need 22% more SCO assistance than younger segments",
          "Leaders who redesign for fresh basket types capture significant transaction value gains",
        ],
        cta: "Benchmark Kroger's shopper experience against category leaders",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Scanner failures frustrate 65% of Kroger shoppers — while investment chases biometric checkout.",
        body: "Product identification failures are the #1 delay driver — not the emerging tech capturing headlines. Only 15% of retailers have deployed auto product ID despite 51% shopper demand. For Kroger, where experience is the edge against value chains, the fastest wins come from fixing what's already broken.",
        stat: "51%",
        statLabel: "of shoppers want automatic product identification",
        bullets: [
          "Reliability improvements at 2,700 stores deliver compounding satisfaction gains",
          "Reducing top 5 friction sources drives 3x the ROI of innovation-first investment",
          "Biometric checkout usage: only 11% of shoppers have ever tried it",
        ],
        cta: "Align Kroger's technology investments to shopper demand",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Kroger Plus is one of grocery's most powerful loyalty assets — SCO should prove it.",
        body: "Only 38% of retailers are satisfied with their SCO integration quality. When Kroger Plus benefits don't surface seamlessly at checkout, loyalty investment loses its most high-frequency proof point. Leaders treat integration as a moat, not a migration.",
        stat: "38%",
        statLabel: "satisfied with current SCO system integration",
        bullets: [
          "Kroger Plus personalization must work at SCO without creating additional friction steps",
          "Digital coupon redemption failures at SCO are the top loyalty dissatisfier",
          "Banner-specific integration requirements add complexity — leaders unify beneath them",
        ],
        cta: "Evaluate Kroger's loyalty-SCO integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Kroger's data advantage only matters if SCO measurement keeps pace with the rest of the enterprise.",
        body: "Only 25% of retailers have high confidence in their SCO data — yet nearly all are making major capital decisions based on it. Across 2,700 stores and 20+ banners, Kroger's cost of acting on low-confidence data compounds dramatically.",
        stat: "25%",
        statLabel: "have high confidence in SCO KPI data",
        bullets: [
          "Banner-to-banner comparisons require normalized baselines — raw data misleads",
          "Shrink attribution at SCO vs. POS is tracked by only 31% of retailers",
          "Leaders link SCO metrics to basket size trend, loyalty rate, and labor productivity",
        ],
        cta: "Assess Kroger's SCO measurement architecture",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Kroger's competitive position in fresh grocery will be decided by which SCO archetype it becomes.",
        body: "Platform Builders achieve 92% satisfaction. Feature Deployers reach 76%. Resisters trail at 58%. In Kroger's competitive markets — facing Walmart, Aldi, and Amazon — the right SCO archetype is a strategic decision, not a technology one.",
        stat: "16pts",
        statLabel: "satisfaction gap between builders and deployers",
        bullets: [
          "Platform builders compound advantages every quarter — the gap widens over time",
          "Multi-banner environments favor retailers who unify execution beneath banner diversity",
          "Kroger's loyalty depth is a platform builder accelerant — if SCO is built to leverage it",
        ],
        cta: "Map Kroger's path to platform builder status",
      },
    ],
  },

  // ─── 3. COSTCO ─────────────────────────────────────────────────────────────
  {
    id: "costco",
    name: "Costco Wholesale Corporation",
    shortName: "Costco",
    customerTerm: "members",
    tagline: "Member Value. Always.",
    description:
      "The world's top bulk-buy warehouse club — where members pay for the privilege of shopping and expect premium value at every touchpoint.",
    accentColor: "#E31837",
    heroHeadline: "Members Expect Premium Execution — SCO Is Where That Promise Gets Tested",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how the industry's top operators serve high-value customers. Here's what it means for Costco.",
    contextStat: [
      { value: "92%", label: "U.S. member renewal rate" },
      { value: "600+", label: "U.S. warehouse locations" },
      { value: "$120+", label: "average transaction value" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "Costco members pay to be here. SCO execution must match that premium expectation.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For Costco, the stakes are higher — a member who encounters repeated SCO friction doesn't just leave frustrated, they question a $65 annual decision. Execution gaps at Costco aren't just operational. They're existential to the membership model.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "Warehouse format SCO handles fewer, larger transactions — each failure is more visible",
          "High item value means associate empowerment for price overrides is non-negotiable",
          "Costco's operational precision culture is an execution advantage waiting to be applied to SCO",
        ],
        cta: "See where warehouse-format operators benchmark",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Large baskets are Costco's entire business model — SCO currently can't reliably handle them.",
        body: "65% of SCO trips industry-wide involve 10 items or fewer. Costco's average transaction is the opposite. When members attempt large-basket SCO and encounter failure, they don't just leave the lane — they remember it at renewal time.",
        stat: "65%",
        statLabel: "of industry SCO trips use 10 items or fewer",
        bullets: [
          "Bulk pack scanning and barcode reliability are acute challenges at Costco volumes",
          "Age verification and alcohol handling at SCO are high-frequency friction points",
          "Leaders designing for large-basket trip types see the strongest throughput gains",
        ],
        cta: "Benchmark Costco's SCO against high-basket-size operators",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Costco's tech investment philosophy is disciplined — SCO is where that discipline creates advantage.",
        body: "51% of shoppers want automatic product identification. Only 15% of retailers have delivered it. Costco's culture of deliberate, high-ROI investment is precisely the decision framework SCO modernization requires — foundational reliability before emerging technology.",
        stat: "3x",
        statLabel: "ROI from reliability vs. innovation-first investment",
        bullets: [
          "Scanner accuracy at bulk SKU scale is the #1 intervention driver for warehouse formats",
          "Costco's limited SKU count makes product ID automation highly achievable",
          "Fixing scanner friction eliminates the most common associate call-forward event",
        ],
        cta: "Align Costco's SCO investment to highest-ROI opportunities",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Costco's membership IS the loyalty program — SCO must honor that relationship at every transaction.",
        body: "Without a traditional loyalty card, Costco's membership card is the only integration point between the member relationship and checkout. Only 38% of retailers are satisfied with their SCO system integration. For Costco, this number represents the gap between a transactional checkout and a member experience.",
        stat: "38%",
        statLabel: "satisfied with SCO system integration",
        bullets: [
          "Executive Membership benefits need real-time recognition at SCO",
          "Costco app integration with SCO is an early-stage opportunity competitors haven't captured",
          "Payment system integration (Visa exclusivity) must work flawlessly every transaction",
        ],
        cta: "Evaluate Costco's SCO integration against member expectations",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Costco's format is unique — generic SCO benchmarks don't apply. Neither does generic measurement.",
        body: "Only 25% of retailers have high confidence in their SCO data. For Costco, with fewer stores but higher transaction values, every measurement gap represents significant revenue and experience insight missed. Warehouse-specific KPI architecture is a prerequisite for confident action.",
        stat: "25%",
        statLabel: "of retailers trust their SCO data for decisions",
        bullets: [
          "Transaction value per SCO event is the primary metric — items per trip is secondary",
          "Shrink at Costco's price points requires distinct SCO attribution from POS shrink",
          "Member satisfaction tied to SCO performance is the leading indicator of renewal risk",
        ],
        cta: "Build Costco's SCO measurement confidence framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Costco's membership model is a platform. SCO should be built to match.",
        body: "Platform Builders achieve 92% satisfaction vs. 58% for Transformation Resisters. Costco's membership culture — where value is integrated into every touchpoint — is the philosophical foundation of a platform builder. The question is whether SCO technology execution matches the brand's operating ambition.",
        stat: "92%",
        statLabel: "satisfaction among Platform Builder retailers",
        bullets: [
          "Platform builders achieve 95% system uptime — critical for high-value warehouse transactions",
          "Costco's limited format count accelerates platform builder execution vs. multi-banner peers",
          "Member renewal rates correlate directly with experience consistency across all touchpoints",
        ],
        cta: "Map Costco's SCO platform builder roadmap",
      },
    ],
  },

  // ─── 4. ALBERTSONS ─────────────────────────────────────────────────────────
  {
    id: "albertsons",
    name: "Albertsons Companies",
    shortName: "Albertsons",
    customerTerm: "customers",
    tagline: "Inspired People. Inspired Food.",
    description:
      "One of the nation's largest food and drug retailers with 2,200+ stores across 20+ banners — turning multi-banner complexity into competitive scale.",
    accentColor: "#E31837",
    heroHeadline: "20 Banners. One SCO Challenge. The Benchmark Shows the Path Forward.",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how multi-banner operators are turning complexity into competitive advantage. Here's what it means for Albertsons.",
    contextStat: [
      { value: "2,200+", label: "stores across 20+ banners" },
      { value: "35M+", label: "loyalty members" },
      { value: "33M+", label: "weekly customer visits" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "20+ banners means 20+ execution realities — and the benchmark shows the gap in each.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For Albertsons, with Safeway's premium positioning and Jewel-Osco's urban density and Tom Thumb's Texas footprint, a single execution standard doesn't exist. The leaders managing this complexity are building banner-flexible systems, not banner-specific ones.",
        stat: "14%",
        statLabel: "of retailers at best-in-class execution maturity",
        bullets: [
          "Each banner carries distinct shopper expectations — Safeway vs. ACME vs. Randalls aren't the same",
          "Associate empowerment standards must be consistent even when experience standards vary",
          "Just for U loyalty performance at SCO differs materially by banner and store format",
        ],
        cta: "See how Albertsons' execution compares across banner types",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Albertsons' 35M loyalty members are limiting basket size to match SCO limitations, not their needs.",
        body: "Customers calibrate trips to system capability. Weighted produce, deli items, and complex baskets migrate to staffed lanes. Across 2,200 Albertsons stores, this behavioral adaptation suppresses basket size and increases labor cost simultaneously.",
        stat: "40%",
        statLabel: "of complex-item SCO transactions trigger staff intervention",
        bullets: [
          "Fresh departments drive Albertsons' differentiation — SCO must handle fresh without friction",
          "Urban banner shoppers (ACME, Shaw's) have higher SCO expectations than suburban formats",
          "Leaders removing fresh-basket friction see significant transaction value recovery",
        ],
        cta: "Benchmark Albertsons' shopper experience performance",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Albertsons' innovation investment is fragmented across banners — delivering diluted returns everywhere.",
        body: "Scanner failures remain the #1 delay driver, cited by 65% of shoppers. Without a unified technology roadmap across banners, Albertsons risks investing in emerging capabilities before foundational reliability is solved — at 20x the coordination cost.",
        stat: "65%",
        statLabel: "of shoppers cite scanner issues as their top delay",
        bullets: [
          "Unified technology procurement across banners creates scale leverage on reliability investments",
          "Auto product ID (wanted by 51% of shoppers) is a high-ROI priority for fresh-heavy formats",
          "Banner-by-banner rollout prevents compounding returns — enterprise alignment is the accelerant",
        ],
        cta: "Align Albertsons' SCO investment across the banner portfolio",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Just for U is one of grocery's strongest loyalty assets — SCO should be its most powerful proof point.",
        body: "Only 38% of retailers are satisfied with their SCO integration quality. Across 20+ Albertsons banners with varied legacy systems, integration quality is inconsistent. Every failed loyalty recognition at SCO is a moment when the Just for U promise goes unredeemed.",
        stat: "38%",
        statLabel: "satisfied with current SCO integration quality",
        bullets: [
          "Just for U personalized offers must surface at SCO without requiring shopper action",
          "Banner-specific loyalty integrations create inconsistent member experiences enterprise-wide",
          "Leaders treating SCO-loyalty integration as a unified system achieve 95% uptime benchmarks",
        ],
        cta: "Evaluate Albertsons' loyalty-SCO integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Measurement siloed by banner prevents Albertsons from seeing the enterprise SCO picture.",
        body: "Only 25% of retailers have high confidence in SCO data. Across Albertsons' 20+ banners, siloed measurement prevents the enterprise-level insight that drives capital allocation and competitive positioning. Banner comparisons without normalization mislead as often as they illuminate.",
        stat: "25%",
        statLabel: "of retailers trust their SCO KPI data",
        bullets: [
          "Normalized performance benchmarks across banners are the prerequisite for enterprise decisions",
          "Shrink attribution varies by store format — a superset metric masks critical signals",
          "Leaders connect SCO KPIs to loyalty program performance and banner-level NPS",
        ],
        cta: "Build Albertsons' enterprise SCO measurement framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Albertsons' scale enables platform builder status — but only if banner complexity is turned into an asset.",
        body: "Platform Builders achieve 92% customer satisfaction. Feature Deployers reach 76%. For Albertsons, the platform builder path runs through a unified integration layer that lets banners express local identity while sharing the technology platform that drives performance.",
        stat: "92% vs. 76%",
        statLabel: "satisfaction gap between builders and deployers",
        bullets: [
          "Banner diversity is a market coverage advantage — not a technology fragmentation excuse",
          "Shared SCO platform with banner-configurable experience is the architectural target",
          "Just for U loyalty depth accelerates platform builder ROI vs. retailers starting from scratch",
        ],
        cta: "Define Albertsons' path to platform builder status",
      },
    ],
  },

  // ─── 5. ALDI ───────────────────────────────────────────────────────────────
  {
    id: "aldi",
    name: "ALDI",
    shortName: "ALDI",
    customerTerm: "customers",
    tagline: "Good. Different.",
    description:
      "America's fastest-growing grocery chain with 2,400+ stores — where efficiency is the brand promise and every operational decision must honor it.",
    accentColor: "#00A0DF",
    heroHeadline: "ALDI's Efficiency Edge Should Make SCO Excellence Easier. The Benchmark Says Otherwise.",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals where efficiency-first retailers are winning and where friction still costs them. Here's what it means for ALDI.",
    contextStat: [
      { value: "2,400+", label: "U.S. store locations" },
      { value: "#1", label: "fastest-growing U.S. grocery chain" },
      { value: "1,400", label: "average SKUs vs. 30,000 at traditional grocers" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "ALDI's efficiency model should produce best-in-class SCO by default. The benchmark says only 14% get there.",
        body: "ALDI's format — limited SKUs, no frills, high throughput — is theoretically optimal for SCO excellence. But execution maturity requires deliberate investment in standards, training, and measurement. Format advantage doesn't translate automatically into benchmark leadership.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "Limited assortment means every SKU at SCO should scan correctly — failures are proportionally more damaging",
          "ALDI's rapid store growth requires systematic execution standards to maintain consistency",
          "High-throughput format amplifies the cost of every second of SCO friction",
        ],
        cta: "See where ALDI-format operators rank on execution maturity",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "ALDI shoppers are efficiency-motivated — SCO friction contradicts the entire value proposition.",
        body: "ALDI attracts shoppers who come for speed and simplicity. When SCO fails — scanner errors, intervention delays, payment friction — it directly undermines the reason customers chose ALDI over traditional grocers. The loyalty built on price erodes fast when time costs spike at checkout.",
        stat: "65%",
        statLabel: "of SCO trips delayed by scanner reliability issues",
        bullets: [
          "ALDI's private-label barcodes require consistent scan performance — one failure is noticeable at 1,400 SKUs",
          "Efficiency shoppers have lower tolerance for intervention delays than experience shoppers",
          "Leaders in efficiency formats see the strongest correlation between SCO speed and return visit frequency",
        ],
        cta: "Benchmark ALDI's SCO speed and reliability performance",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "ALDI's tech-minimal philosophy is a strength — if applied to SCO in the right sequence.",
        body: "51% of shoppers want automatic product identification. ALDI's limited SKU count makes this more achievable than at any other retailer. Rather than chasing emerging technology, ALDI's investment philosophy — deliberate, high-certainty ROI — is perfectly aligned with the SSEB's recommended investment sequence.",
        stat: "51%",
        statLabel: "of shoppers want automatic product identification",
        bullets: [
          "1,400 SKUs makes automated product recognition highly cost-effective at ALDI's scale",
          "Scanner reliability investment at ALDI delivers the fastest measurable payback in grocery",
          "ALDI's format limits the innovation surface — making foundational excellence more achievable",
        ],
        cta: "Define ALDI's highest-ROI SCO investment priorities",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "ALDI has no traditional loyalty program — which means SCO IS the relationship.",
        body: "Without a points program or loyalty card, ALDI's SCO experience is the primary mechanism for building repeat behavior. Only 38% of retailers are satisfied with their SCO integration. For ALDI, integration quality defines whether SCO reinforces the brand promise or quietly undermines it.",
        stat: "38%",
        statLabel: "satisfied with current SCO system integration",
        bullets: [
          "ALDI app integration with SCO — digital coupons, weekly ads — is the emerging loyalty touchpoint",
          "Payment integration quality is the primary SCO integration variable for ALDI shoppers",
          "Without a loyalty system, SCO uptime and reliability are the de facto loyalty metrics",
        ],
        cta: "Evaluate ALDI's SCO integration and reliability architecture",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "ALDI's simple format should produce simple, high-confidence SCO data. The benchmark says most retailers don't get there.",
        body: "Only 25% of retailers trust their SCO data enough to make confident strategic decisions. For ALDI, where operational efficiency is the competitive edge, low measurement confidence means efficiency improvements go unidentified and unvalidated — a direct contradiction of the brand operating model.",
        stat: "25%",
        statLabel: "of retailers have high SCO data confidence",
        bullets: [
          "Throughput per lane is ALDI's primary SCO metric — not items per transaction",
          "Shrink measurement at SCO must be granular to manage risk at ALDI's price architecture",
          "Associate intervention frequency is the leading indicator of scanner reliability degradation",
        ],
        cta: "Build ALDI's SCO measurement confidence framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "ALDI's format is purpose-built for platform builder status. Execution speed is the only variable.",
        body: "Platform Builders achieve 92% satisfaction. ALDI's limited SKU count, single format, and efficiency-first culture eliminate most of the complexity that holds other retailers at Feature Deployer status. The path to 92% is shorter for ALDI than for any other retailer in this benchmark.",
        stat: "92%",
        statLabel: "satisfaction achieved by Platform Builder retailers",
        bullets: [
          "Single format, limited SKU count, no banner complexity — the barriers are lower",
          "Efficiency culture means associates are already optimization-oriented — a training accelerant",
          "Platform builder status at ALDI would be fastest to achieve and hardest for competitors to match",
        ],
        cta: "Map ALDI's accelerated path to platform builder status",
      },
    ],
  },

  // ─── 6. AMAZON / WHOLE FOODS ───────────────────────────────────────────────
  {
    id: "amazon-whole-foods",
    name: "Amazon / Whole Foods Market",
    shortName: "Whole Foods",
    customerTerm: "customers",
    tagline: "Eat Well. Live Well.",
    description:
      "The technology-led grocery operator with 500+ Whole Foods locations backed by Amazon's platform — where innovation expectations are the highest in retail.",
    accentColor: "#00A651",
    heroHeadline: "Whole Foods Sets the Technology Bar. The Benchmark Reveals Where SCO Still Falls Short.",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals what separates technology leaders from technology winners. Here's what it means for Amazon and Whole Foods.",
    contextStat: [
      { value: "500+", label: "Whole Foods Market locations" },
      { value: "200M+", label: "Amazon Prime members globally" },
      { value: "#1", label: "in grocery technology innovation perception" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "Just Walk Out raised the bar for checkout experience. Conventional SCO at Whole Foods hasn't kept pace.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For Whole Foods, where shoppers arrive with Amazon-caliber technology expectations, the gap between innovation narrative and store-level SCO execution is measured in customer perception — not just operational metrics.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "Whole Foods shoppers have higher expectations than any other grocery segment — SCO must match them",
          "Just Walk Out availability in select stores creates inconsistent expectations across the fleet",
          "Amazon's operational precision culture is an execution accelerant — if applied to SCO systematically",
        ],
        cta: "See where premium-format operators benchmark on execution maturity",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Whole Foods shoppers expect technology to work — and when SCO doesn't, it breaks harder.",
        body: "Premium shoppers have the lowest friction tolerance in grocery. When intervention delays hit a Whole Foods SCO lane, it doesn't just slow the transaction — it actively conflicts with the technology leadership expectation that Amazon's brand has created.",
        stat: "40%",
        statLabel: "of fresh-basket SCO transactions trigger staff intervention",
        bullets: [
          "Organic and specialty items have lower barcode reliability — a Whole Foods-specific challenge",
          "Prime member recognition at SCO should be instant and frictionless — currently it isn't always",
          "Fresh and prepared food items require the highest SCO reliability to match staffed-lane quality",
        ],
        cta: "Benchmark Whole Foods' shopper SCO experience",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Amazon's technology investment in checkout is unmatched. The foundational gaps are still the same.",
        body: "Scanner failures and product identification remain the #1 delay driver — for Whole Foods shoppers too. Just Walk Out solves the problem by eliminating the lane entirely. But in conventional SCO formats, the same reliability gaps that affect every grocer affect Whole Foods as well.",
        stat: "65%",
        statLabel: "of shoppers cite scanner issues as their top delay",
        bullets: [
          "Specialty and organic SKU diversity creates higher product ID complexity than conventional grocery",
          "Auto product ID is a solved technology problem for Amazon — deployment to SCO is the gap",
          "Amazon's technology platform should enable 51% shopper demand for auto product ID faster than any peer",
        ],
        cta: "Align Amazon's technology capabilities to Whole Foods SCO needs",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Amazon Prime and Whole Foods is the most powerful loyalty-grocery integration in retail. SCO should prove it every trip.",
        body: "Only 38% of retailers are satisfied with their SCO integration quality. For Amazon and Whole Foods, underperforming on integration isn't a technology constraint — it's a missed opportunity to use an unmatched loyalty relationship as a checkout advantage.",
        stat: "38%",
        statLabel: "satisfied with SCO system integration",
        bullets: [
          "Prime member discounts must surface instantly at SCO — any friction undermines the benefit perception",
          "Alexa, Just Walk Out, and Dash integration at SCO is the product integration others can't replicate",
          "Amazon Fresh vs. Whole Foods integration creates inconsistent Prime member experiences to resolve",
        ],
        cta: "Evaluate Amazon's SCO integration against its own technology standard",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Amazon's data capabilities are world-class. SCO measurement should set the industry standard.",
        body: "Only 25% of retailers have high confidence in SCO data. For Amazon, with its measurement infrastructure advantage, Whole Foods SCO measurement should exceed benchmark leader standards — not match them. The gap between Amazon's data capability and Whole Foods SCO insight is an internal integration problem.",
        stat: "25%",
        statLabel: "of retailers trust their SCO data for strategic decisions",
        bullets: [
          "Amazon's customer data platform should feed real-time SCO performance dashboards by store",
          "Prime member SCO satisfaction is a loyalty retention signal Amazon can track more precisely than any peer",
          "Just Walk Out data provides a natural control group for measuring conventional SCO performance gaps",
        ],
        cta: "Measure how Whole Foods SCO insight compares to Amazon's data capabilities",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Amazon should be the defining example of Platform Builder status in grocery. The benchmark shows the work isn't finished.",
        body: "Platform Builders achieve 92% satisfaction vs. 58% for Transformation Resisters. Amazon's technology integration capability, Prime loyalty depth, and operational scale position it as the natural leader of this category. The question is whether Whole Foods SCO execution has caught up to Amazon's platform ambition.",
        stat: "92%",
        statLabel: "satisfaction among Platform Builder retailers",
        bullets: [
          "Just Walk Out, Dash, and Alexa represent a platform no other grocer can assemble",
          "Whole Foods conventional SCO must match the technology expectation Amazon's brand creates",
          "Platform builder compounding: Amazon's data advantage grows with every SCO interaction captured",
        ],
        cta: "Map Amazon and Whole Foods' platform builder position",
      },
    ],
  },

  // ─── 7. PUBLIX ─────────────────────────────────────────────────────────────
  {
    id: "publix",
    name: "Publix Super Markets",
    shortName: "Publix",
    customerTerm: "customers",
    tagline: "Where Shopping Is a Pleasure",
    description:
      "The Southeast's premier supermarket chain with 1,400+ locations — where associate-led service excellence is the brand and competitive moat.",
    accentColor: "#108234",
    heroHeadline: "Publix's Service Promise Extends to Every Lane — Including Self-Checkout",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how service-first retailers are navigating the self-service shift. Here's what it means for Publix.",
    contextStat: [
      { value: "1,400+", label: "Southeast store locations" },
      { value: "#1", label: "in customer satisfaction among U.S. supermarkets" },
      { value: "200K+", label: "associate-owners" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "Publix sets the standard for staffed-lane service. SCO execution is where that reputation is now tested.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For Publix, where \"Where Shopping Is a Pleasure\" is a lived operational standard, SCO that falls short of that promise isn't just a technology gap — it's a brand experience contradiction that loyal customers notice immediately.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "Publix associates are the brand differentiator — SCO must be designed to extend that experience, not replace it",
          "Service-culture retailers often underinvest in SCO execution because they view it as secondary",
          "Leaders who build SCO around service principles — not just throughput — achieve the highest satisfaction scores",
        ],
        cta: "See how service-first retailers benchmark on SCO maturity",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Publix shoppers expect a premium experience in every lane — friction at SCO feels like a broken promise.",
        body: "Shoppers calibrate expectations based on brand. When Publix's SCO fails to match the service level customers receive at staffed lanes, dissatisfaction is amplified by the contrast. The benchmark's highest-risk gap for service leaders is the experience delta between their staffed and self-service lanes.",
        stat: "22%",
        statLabel: "higher SCO assistance need among core Publix shopper age segments",
        bullets: [
          "Publix's 55+ shopper base has the highest SCO assistance requirement — experience design matters",
          "Fresh and deli items are Publix's SCO friction concentration — weighted items trigger 40% of interventions",
          "Connecting associates to SCO oversight (rather than removing them) is Publix's natural execution model",
        ],
        cta: "Benchmark Publix's SCO experience against service-leader standards",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Publix invests in people. The benchmark shows SCO technology investment must follow the same logic.",
        body: "Scanner failures frustrate 65% of shoppers. For Publix, where the associate experience sets a high bar, SCO technology that doesn't meet the same standard creates a visible two-tier experience. Investment in reliability isn't a technology initiative — for Publix, it's a service initiative.",
        stat: "65%",
        statLabel: "cite scanner reliability as their top SCO delay",
        bullets: [
          "Publix's service model means associate-assisted SCO is a feature, not a failure mode",
          "Reliability investment at SCO extends Publix's service advantage into self-service formats",
          "Auto product ID (demanded by 51% of shoppers) reduces intervention frequency while maintaining service quality",
        ],
        cta: "Align Publix's SCO technology investment with service values",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Publix's digital ecosystem is growing — SCO is where loyalty investment delivers its highest ROI.",
        body: "Only 38% of retailers are satisfied with their SCO system integration. Publix's digital savings programs and app-based coupons must work at SCO without friction to deliver on their promise. Integration quality determines whether digital investment strengthens or weakens the Publix shopping experience.",
        stat: "38%",
        statLabel: "satisfied with current SCO system integration",
        bullets: [
          "Digital coupon redemption at SCO is the most common loyalty friction point for Publix shoppers",
          "Publix app integration with SCO is the primary integration priority — driving both satisfaction and repeat visits",
          "Leaders whose loyalty and SCO systems speak the same language achieve consistently higher basket sizes",
        ],
        cta: "Evaluate Publix's digital-SCO integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Publix measures associate performance with precision. SCO performance measurement deserves the same rigor.",
        body: "Only 25% of retailers have high confidence in their SCO data. For Publix, where people performance is tracked with care, applying the same measurement discipline to SCO creates the feedback loop needed to continuously improve the self-service experience.",
        stat: "25%",
        statLabel: "of retailers trust their SCO KPI data",
        bullets: [
          "Associate intervention rate is Publix's leading SCO performance indicator — already a familiar metric",
          "Customer satisfaction at SCO vs. staffed lanes is Publix's primary measurement priority",
          "Shrink at SCO should be tracked distinctly — only 31% of retailers currently do this",
        ],
        cta: "Build Publix's SCO measurement framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Service leaders who become Platform Builders don't replace service with technology — they scale it.",
        body: "Platform Builders achieve 92% satisfaction. Publix's path to platform builder status runs through building SCO as an extension of its service culture — not a replacement for it. The retailers achieving 92% satisfaction aren't the ones who eliminated associates from SCO. They're the ones who redesigned the role.",
        stat: "92%",
        statLabel: "satisfaction among Platform Builder retailers",
        bullets: [
          "Platform builders design SCO so associates spend time adding value, not managing failures",
          "Publix's associate ownership culture is a platform builder accelerant — buy-in is built in",
          "High satisfaction at staffed lanes becomes a ceiling to match at SCO — not a benchmark to abandon",
        ],
        cta: "Map Publix's service-led path to platform builder status",
      },
    ],
  },

  // ─── 8. TARGET ─────────────────────────────────────────────────────────────
  {
    id: "target",
    name: "Target Corporation",
    shortName: "Target",
    customerTerm: "guests",
    tagline: "Expect More. Pay Less.",
    description:
      "The omnichannel retail leader with 1,900+ stores and 100M+ Target Circle members — where digital excellence and physical experience must converge.",
    accentColor: "#CC0000",
    heroHeadline: "Target Circle Has 100M+ Members. SCO Is Where That Relationship Gets Realized.",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how omnichannel leaders are turning loyalty into checkout advantage. Here's what it means for Target.",
    contextStat: [
      { value: "1,900+", label: "U.S. store locations" },
      { value: "100M+", label: "Target Circle members" },
      { value: "$30B+", label: "annual digital sales" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "Target's guest experience strategy is sophisticated. SCO execution is where that sophistication gets tested.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For Target, where \"Expect More. Pay Less.\" sets dual expectations on experience and value, SCO that underdelivers on either dimension contradicts the brand. Digital-first guests arrive with high expectations for checkout technology — not just price.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "Target's small-format and full-size stores require differentiated SCO execution approaches",
          "Guest experience standards must be consistent across urban Targets and suburban supercenters",
          "Target Circle loyalty perception is shaped more at checkout than at any other touchpoint",
        ],
        cta: "See where Target ranks on SCO execution maturity",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Target's digitally native guests expect SCO to match the app experience. Currently it doesn't.",
        body: "Target's core shopper is among the most app-engaged in retail. When SCO doesn't recognize Circle offers, handle mixed baskets smoothly, or match the speed of the digital experience, it creates a friction contrast that digitally engaged guests notice — and remember.",
        stat: "65%",
        statLabel: "of SCO trips limited by system capability, not shopper intent",
        bullets: [
          "General merchandise + grocery baskets create unique SCO complexity for Target's format",
          "Millennial and Gen Z guests (Target's core) have the lowest friction tolerance at SCO",
          "Leaders who design for cross-category basket complexity see 22% higher SCO transaction values",
        ],
        cta: "Benchmark Target's guest SCO experience performance",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Target's technology investment is omnichannel-first — which means SCO hardware gets deprioritized.",
        body: "Scanner reliability issues frustrate 65% of shoppers — including at Target. Omnichannel investment in same-day delivery and Drive Up is creating a growing gap: the digital experience improves faster than the in-store SCO experience, creating visible inconsistency for omnichannel guests.",
        stat: "65%",
        statLabel: "cite scanner reliability as their top SCO delay driver",
        bullets: [
          "Target's mixed-merchandise format creates higher product ID complexity than pure-grocery peers",
          "Drive Up excellence raises the bar for in-store SCO — omnichannel leaders see this contrast most sharply",
          "Closing the digital-physical experience gap at SCO is Target's highest-visibility reliability opportunity",
        ],
        cta: "Align Target's technology investment across digital and physical SCO",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "Target Circle is one of retail's most powerful loyalty assets. SCO should be its most compelling proof point.",
        body: "Only 38% of retailers are satisfied with their SCO integration quality. Target Circle's 100M+ members arrive at SCO expecting their offers, rewards, and purchase history to be instantly recognized. When integration fails, the loyalty investment delivers its worst possible return at its highest-frequency touchpoint.",
        stat: "38%",
        statLabel: "satisfied with current SCO system integration",
        bullets: [
          "Circle offer recognition at SCO must be automatic — requiring guest action is a retention risk",
          "REDcard integration with Circle offers creates the strongest loyalty-value combination in Target's portfolio",
          "Target's app-native guest base expects digital wallet and loyalty to work seamlessly at every lane",
        ],
        cta: "Evaluate Target Circle's SCO integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Target's analytics capabilities are enterprise-grade. SCO measurement should match.",
        body: "Only 25% of retailers have high confidence in SCO data. For Target, with sophisticated demand sensing and inventory intelligence, applying the same data rigor to SCO creates the performance feedback loop that connects checkout experience to guest lifetime value.",
        stat: "25%",
        statLabel: "of retailers trust their SCO data for strategic decisions",
        bullets: [
          "Circle member SCO satisfaction is a leading indicator of program engagement and redemption",
          "Cross-category basket SCO performance requires format-specific KPI baselines",
          "Leaders connect SCO throughput data to same-day fulfillment capacity planning",
        ],
        cta: "Build Target's SCO measurement confidence framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Target's omnichannel position makes it a natural Platform Builder. Execution is the remaining gap.",
        body: "Platform Builders achieve 92% satisfaction vs. 58% for Transformation Resisters. Target's Circle ecosystem, app infrastructure, and omnichannel integration capability are the building blocks of a platform builder architecture. The question is whether SCO execution has been elevated to match the digital experience standard.",
        stat: "92% vs. 76%",
        statLabel: "Platform Builders vs. Feature Deployers",
        bullets: [
          "Target's app-first culture accelerates platform builder adoption — guests are already integration-ready",
          "Circle loyalty integration with SCO would create the strongest digital-physical loop in Target's business",
          "Omnichannel leaders who achieve platform builder SCO status see the largest loyalty-driven basket size gains",
        ],
        cta: "Map Target's path to platform builder SCO status",
      },
    ],
  },

  // ─── 9. H-E-B ──────────────────────────────────────────────────────────────
  {
    id: "heb",
    name: "H-E-B",
    shortName: "H-E-B",
    customerTerm: "customers",
    tagline: "Here Everything's Better",
    description:
      "Texas's dominant grocery chain with 400+ locations — where community loyalty and operational precision are the twin pillars of an unmatched competitive position.",
    accentColor: "#E31837",
    heroHeadline: "H-E-B's Operational Excellence Is Legendary. SCO Is the Next Frontier.",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how community-first retailers are building self-service advantage. Here's what it means for H-E-B.",
    contextStat: [
      { value: "400+", label: "Texas and Mexico locations" },
      { value: "#1", label: "grocery customer satisfaction in Texas" },
      { value: "80%+", label: "of Texans shop at H-E-B" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "H-E-B's operational reputation is built on staffed-lane excellence. SCO is where that reputation gets extended — or protected.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For H-E-B, where operational precision is a competitive weapon, applying the same execution discipline to self-checkout is both a natural extension and an urgent priority as SCO transaction share grows.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "H-E-B's store-format diversity — from Mi Tienda to Central Market — requires tailored SCO execution",
          "Texas market loyalty means SCO failures carry higher-than-average brand cost for H-E-B",
          "H-E-B's operational culture is built for precision execution — SCO standards can be elevated quickly",
        ],
        cta: "See how H-E-B's execution compares to benchmark leaders",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "H-E-B shoppers do weekly stock-up trips. SCO can't reliably handle the basket they bring.",
        body: "Texas grocery trips skew large. H-E-B shoppers fill baskets with fresh, specialty, and private-label items. When SCO can't handle that complexity — weighted produce, specialty items, large basket sizes — loyal customers don't abandon H-E-B. They just go to a staffed lane and add labor cost.",
        stat: "40%",
        statLabel: "of complex-item transactions trigger staff intervention",
        bullets: [
          "H-E-B's fresh and private-label depth creates above-average SCO complexity per trip",
          "Texas shoppers' high basket size means SCO failures have higher per-event revenue impact",
          "H-E-B Central Market shoppers carry the highest basket complexity — and the lowest intervention tolerance",
        ],
        cta: "Benchmark H-E-B's SCO shopper experience performance",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "H-E-B invests in community, not trends. That philosophy is exactly right for SCO modernization.",
        body: "Scanner failures frustrate 65% of shoppers. H-E-B's investment discipline — avoiding trend-chasing in favor of high-certainty operational returns — is the right framework for SCO modernization. Fix scanner reliability, reduce intervention friction, and then layer in technology that serves Texas shoppers specifically.",
        stat: "51%",
        statLabel: "of shoppers want automatic product identification",
        bullets: [
          "H-E-B private label SKUs need scanner reliability investment specific to its product catalog",
          "Texas market tech expectations are rising — H-E-B's reputation for excellence extends to digital",
          "Community-specific investments (bilingual SCO, local product recognition) are differentiation opportunities",
        ],
        cta: "Align H-E-B's SCO investment with community-first priorities",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "H-E-B's digital ecosystem is growing fast. SCO integration will determine whether loyalty accelerates.",
        body: "Only 38% of retailers are satisfied with their SCO integration quality. H-E-B's digital investments — curbside, delivery, H-E-B app — are building loyalty infrastructure. SCO is the in-store proof point that either validates digital investment or contradicts it.",
        stat: "38%",
        statLabel: "satisfied with current SCO integration quality",
        bullets: [
          "H-E-B app digital coupon redemption at SCO is a growing friction source to resolve",
          "H-E-B Go (scan-and-go) integration provides a natural platform for SCO technology development",
          "Texas community loyalty is strong enough to survive integration gaps — but not forever",
        ],
        cta: "Evaluate H-E-B's digital-SCO integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "H-E-B runs one of grocery's best-managed operations. SCO measurement should match that rigor.",
        body: "Only 25% of retailers have high confidence in SCO data. For H-E-B, where operational decisions are made with discipline, building high-confidence SCO measurement creates the feedback loop that sustains H-E-B's operational excellence advantage into the self-service era.",
        stat: "25%",
        statLabel: "of retailers trust their SCO KPI data",
        bullets: [
          "Store-level SCO performance variance across H-E-B's diverse formats requires format-specific benchmarks",
          "Texas vs. Mexico market performance comparison requires normalized baselines",
          "Community satisfaction with SCO is H-E-B's leading indicator — linking it to operational KPIs matters",
        ],
        cta: "Build H-E-B's SCO measurement framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "H-E-B's operational culture is a platform builder foundation. Community loyalty is the accelerant.",
        body: "Platform Builders achieve 92% satisfaction vs. 58% for Transformation Resisters. H-E-B's deeply loyal customer base, operational precision culture, and growing digital investment are the ingredients of platform builder status. The path is clearer for H-E-B than for most retailers in this benchmark.",
        stat: "92%",
        statLabel: "satisfaction achieved by Platform Builder retailers",
        bullets: [
          "Community-first operators who reach platform builder status sustain it longer than scale retailers",
          "H-E-B's operational standards provide the execution foundation that most platform builders must build first",
          "Texas market loyalty creates a feedback environment where SCO improvements compound faster",
        ],
        cta: "Map H-E-B's path to platform builder status",
      },
    ],
  },

  // ─── 10. MEIJER ────────────────────────────────────────────────────────────
  {
    id: "meijer",
    name: "Meijer",
    shortName: "Meijer",
    customerTerm: "customers",
    tagline: "Higher Quality. Lower Prices.",
    description:
      "The Midwest's dominant supercenter retailer with 260+ locations — where one-stop shopping across grocery, general merchandise, and pharmacy is the core value proposition.",
    accentColor: "#E31837",
    heroHeadline: "Supercenter SCO Is the Hardest Problem in Self-Checkout. Meijer Runs It Every Day.",
    heroSubheadline:
      "The Self-Service Excellence Benchmark reveals how supercenter-format retailers are turning complexity into competitive advantage. Here's what it means for Meijer.",
    contextStat: [
      { value: "260+", label: "Midwest supercenter locations" },
      { value: "3.5M+", label: "mPerks loyalty members" },
      { value: "90+", label: "years serving Midwest communities" },
    ],
    provocations: [
      {
        number: "01",
        title: "The Strategy-Execution Gap",
        hook: "Meijer's supercenter format creates the most complex SCO execution challenge in retail.",
        body: "Only 14% of retailers reach best-in-class SCO maturity. For Meijer, with grocery, general merchandise, pharmacy, and apparel in a single transaction, that complexity multiplies. Leaders at this format type don't simplify the problem — they build execution systems designed for it.",
        stat: "14%",
        statLabel: "of retailers at best-in-class SCO maturity",
        bullets: [
          "Cross-department baskets require SCO systems built for category diversity, not grocery-only optimization",
          "Midwest community loyalty means SCO execution failures carry high brand relationship cost",
          "Meijer's regional scale enables faster execution improvement cycles than national chains",
        ],
        cta: "See how supercenter-format operators benchmark on SCO maturity",
      },
      {
        number: "02",
        title: "The Shopper Demand Paradox",
        hook: "Meijer shoppers do one-stop trips. SCO must handle grocery, electronics, and clothing in one go.",
        body: "Mixed-category baskets are Meijer's core value proposition — and the most complex SCO challenge in retail. When shoppers can't complete a full Meijer trip at SCO, the one-stop value proposition fails at its final step. Leaders in this format type are redesigning SCO for the basket, not the format norm.",
        stat: "65%",
        statLabel: "of SCO trips constrained to 10 items or fewer",
        bullets: [
          "Cross-category scanning complexity (apparel tags, electronics, produce) creates higher intervention rates",
          "Meijer's Midwest shopper base does high-frequency, high-basket trips — SCO must be designed for this",
          "Leaders designing for one-stop basket complexity see the strongest throughput gains in supercenter formats",
        ],
        cta: "Benchmark Meijer's SCO experience against supercenter peers",
      },
      {
        number: "03",
        title: "The Innovation-Investment Misalignment",
        hook: "Meijer's regional scale requires focused technology investment — starting with reliability, not innovation.",
        body: "Scanner failures frustrate 65% of shoppers — and supercenter mixed categories amplify this challenge. Meijer's investment capacity is best deployed foundationally first: scanner reliability, product ID accuracy, and intervention reduction before emerging technology investment.",
        stat: "3x",
        statLabel: "ROI from reliability vs. innovation-first investment",
        bullets: [
          "Mixed-category barcodes (apparel, general merchandise) require different scanner calibration than grocery",
          "Automated product recognition for high-SKU-diversity formats is the highest-ROI investment available",
          "Meijer's regional focus enables faster implementation cycles than national supercenter peers",
        ],
        cta: "Define Meijer's highest-ROI SCO investment priorities",
      },
      {
        number: "04",
        title: "Integration as Competitive Weapon",
        hook: "mPerks has 3.5M members. SCO is where that loyalty asset should deliver its clearest return.",
        body: "Only 38% of retailers are satisfied with their SCO system integration. Meijer's mPerks program — with fuel rewards, digital coupons, and personalized offers — needs to surface seamlessly at SCO to deliver the value that drives loyalty in a competitive Midwest market.",
        stat: "38%",
        statLabel: "satisfied with current SCO system integration",
        bullets: [
          "mPerks digital coupon redemption at SCO is the #1 integration priority for Meijer loyalty members",
          "Fuel rewards recognition at SCO is a high-frequency, high-visibility proof point for mPerks value",
          "Cross-department transaction integration (grocery + general merchandise) is a Meijer-specific challenge",
        ],
        cta: "Evaluate Meijer's mPerks SCO integration maturity",
      },
      {
        number: "05",
        title: "The Measurement Sophistication Gap",
        hook: "Supercenter SCO measurement requires a more sophisticated KPI architecture than single-category retailers.",
        body: "Only 25% of retailers have high confidence in their SCO data. For Meijer, where cross-category baskets create multi-dimensional performance signals, building the right measurement architecture is the prerequisite for every subsequent SCO improvement initiative.",
        stat: "25%",
        statLabel: "of retailers trust their SCO KPI data",
        bullets: [
          "Cross-category shrink at SCO must be attributed by department — not aggregated to a single metric",
          "mPerks member SCO satisfaction is Meijer's most actionable loyalty retention indicator",
          "Transaction value per SCO event (not items per trip) is the primary metric for Meijer's format",
        ],
        cta: "Build Meijer's supercenter SCO measurement framework",
      },
      {
        number: "06",
        title: "Platform Builders vs. Feature Deployers",
        hook: "Midwest regional leaders who become Platform Builders will lock in competitive advantage for a decade.",
        body: "Platform Builders achieve 92% satisfaction vs. 58% for Transformation Resisters. For Meijer, with 90+ years of Midwest community loyalty and a one-stop format that no regional competitor can match, platform builder status at SCO would create a durable competitive moat in every market Meijer serves.",
        stat: "92%",
        statLabel: "satisfaction achieved by Platform Builder retailers",
        bullets: [
          "Supercenter format complexity means platform builder status is harder — and more defensible once achieved",
          "mPerks loyalty depth gives Meijer a platform builder accelerant that pure-grocery peers lack",
          "Regional community loyalty means SCO improvements compound faster into repeat visit and basket size gains",
        ],
        cta: "Map Meijer's path to platform builder status",
      },
    ],
  },
];

export function getGrocer(id: string): GrocerData | undefined {
  return GROCERS.find((g) => g.id === id);
}

export function getAllGrocerIds(): string[] {
  return GROCERS.map((g) => g.id);
}
