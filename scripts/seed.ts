import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data in correct order
  await prisma.swipe.deleteMany();
  await prisma.stance.deleteMany();
  await prisma.candidateTopic.deleteMany();
  await prisma.measureTopic.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.ballotMeasure.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.jurisdiction.deleteMany();

  // Jurisdictions
  const ca = await prisma.jurisdiction.create({
    data: { name: "California", abbreviation: "CA", type: "state" },
  });
  const nc = await prisma.jurisdiction.create({
    data: { name: "North Carolina", abbreviation: "NC", type: "state" },
  });
  const tx = await prisma.jurisdiction.create({
    data: { name: "Texas", abbreviation: "TX", type: "state" },
  });

  // Topics
  const topics = await Promise.all([
    prisma.topic.create({ data: { name: "Housing", slug: "housing", description: "Affordable housing and development policy", icon: "🏠" } }),
    prisma.topic.create({ data: { name: "Education", slug: "education", description: "K-12 and higher education funding and policy", icon: "📚" } }),
    prisma.topic.create({ data: { name: "Healthcare", slug: "healthcare", description: "Healthcare access and insurance policy", icon: "🏥" } }),
    prisma.topic.create({ data: { name: "Environment", slug: "environment", description: "Climate and environmental protection", icon: "🌿" } }),
    prisma.topic.create({ data: { name: "Economy", slug: "economy", description: "Jobs, taxes, and economic policy", icon: "💼" } }),
    prisma.topic.create({ data: { name: "Public Safety", slug: "public-safety", description: "Law enforcement and criminal justice", icon: "🛡️" } }),
    prisma.topic.create({ data: { name: "Transportation", slug: "transportation", description: "Roads, transit, and infrastructure", icon: "🚆" } }),
    prisma.topic.create({ data: { name: "Technology", slug: "technology", description: "Tech regulation and digital policy", icon: "💻" } }),
    prisma.topic.create({ data: { name: "Immigration", slug: "immigration", description: "Immigration and border policy", icon: "🌎" } }),
    prisma.topic.create({ data: { name: "Civil Rights", slug: "civil-rights", description: "Equality and civil liberties", icon: "⚖️" } }),
  ]);

  const [housing, education, healthcare, environment, economy, safety, transportation, tech, immigration, civilRights] = topics;

  // === BALLOT MEASURES ===
  const measures = [
    { title: "Affordable Housing Bond Act", measureCode: "Prop 5", jurisdictionId: ca.id, electionDate: "2026-11-03", category: "Housing", shortSummary: "Authorizes $10 billion in bonds for affordable housing construction, down payment assistance, and homeownership programs across California.", longSummary: "This proposition would authorize the state to issue $10 billion in general obligation bonds to fund affordable housing programs. The funds would be allocated to construction of affordable rental housing, down payment assistance for first-time homebuyers, housing for veterans and seniors, and infrastructure improvements for new housing developments.", yesMeans: "The state could borrow $10 billion by selling bonds to investors, using the money for housing construction and homeownership assistance programs.", noMeans: "The state would not issue $10 billion in bonds for housing programs. Existing housing programs would continue at their current funding levels.", proArguments: JSON.stringify(["California faces a severe housing shortage; this provides critical funding", "Creates thousands of construction jobs statewide", "Includes protections for veterans and seniors"]), conArguments: JSON.stringify(["Adds $16 billion in debt (including interest) to the state budget", "Bond funding is a temporary fix that doesn't address root causes", "Past housing bonds have been slow to distribute"]), sortOrder: 1, topicIds: [housing.id, economy.id] },
    { title: "Clean Energy Infrastructure Initiative", measureCode: "Prop 8", jurisdictionId: ca.id, electionDate: "2026-11-03", category: "Environment", shortSummary: "Requires California to source 90% of electricity from renewable sources by 2035 and allocates $4 billion for grid modernization.", longSummary: "This measure would accelerate California's renewable energy timeline, requiring 90% clean electricity by 2035. It allocates $4 billion from cap-and-trade revenue toward grid modernization, battery storage, and transmission infrastructure.", yesMeans: "California would accelerate its clean energy targets and invest $4 billion in grid modernization and renewable infrastructure.", noMeans: "Current clean energy targets and timelines would remain in place.", proArguments: JSON.stringify(["Accelerates transition to clean energy", "Reduces dependence on fossil fuels", "Creates green energy jobs"]), conArguments: JSON.stringify(["May increase electricity costs short-term", "Timeline may be too aggressive", "Could cause reliability issues"]), sortOrder: 2, topicIds: [environment.id, economy.id, tech.id] },
    { title: "School Safety and Mental Health Funding Act", measureCode: "Prop 12", jurisdictionId: ca.id, electionDate: "2026-11-03", category: "Education", shortSummary: "Increases the state sales tax by 0.25% to fund school counselors, campus security improvements, and student mental health services.", longSummary: "This proposition would increase the state sales tax rate by one-quarter cent to generate approximately $2.5 billion annually for K-12 schools for hiring counselors, improving campus security, anti-bullying programs, and crisis intervention training.", yesMeans: "A small sales tax increase would fund school mental health services and security improvements.", noMeans: "The sales tax would not increase. Schools would continue to fund these programs through existing budgets.", proArguments: JSON.stringify(["Student mental health is in crisis", "Puts counselors in every school", "10-year sunset clause"]), conArguments: JSON.stringify(["Sales taxes are regressive", "Schools already receive significant funding", "No guarantee of effective use"]), sortOrder: 3, topicIds: [education.id, healthcare.id, safety.id] },
    { title: "Criminal Justice Reform and Rehabilitation Act", measureCode: "Measure B", jurisdictionId: nc.id, electionDate: "2026-11-03", category: "Public Safety", shortSummary: "Redirects 15% of state prison funding to community-based rehabilitation, job training, and re-entry programs for nonviolent offenders.", longSummary: "This measure would require the state to redirect 15% of its annual prison system budget toward community-based alternatives for nonviolent offenders including vocational training, substance abuse treatment, and mental health services.", yesMeans: "Prison funding would shift to community rehabilitation programs with independent oversight.", noMeans: "Current prison funding and rehabilitation program levels would remain unchanged.", proArguments: JSON.stringify(["Reduces recidivism", "Community programs cost less than incarceration", "Creates social work jobs"]), conArguments: JSON.stringify(["Could reduce prison safety resources", "May be seen as soft on crime", "More government bureaucracy"]), sortOrder: 4, topicIds: [safety.id, civilRights.id, economy.id] },
    { title: "Digital Privacy and AI Transparency Act", measureCode: "Prop 3", jurisdictionId: ca.id, electionDate: "2026-11-03", category: "Technology", shortSummary: "Requires companies to disclose AI-generated content, prohibits facial recognition in public spaces, and strengthens personal data protections.", longSummary: "This proposition establishes new digital rights protections. It requires clear labeling of AI-generated content, bans facial recognition in public spaces, and strengthens data privacy by requiring explicit opt-in consent for data collection.", yesMeans: "New protections would require AI content disclosure, ban public facial recognition, and strengthen data privacy.", noMeans: "Current digital privacy and AI regulations would remain unchanged.", proArguments: JSON.stringify(["Protects from AI deepfakes", "Prevents mass surveillance", "Real control over personal data"]), conArguments: JSON.stringify(["May hinder tech innovation", "Limits useful security applications", "Burdensome for small businesses"]), sortOrder: 5, topicIds: [tech.id, civilRights.id] },
    { title: "Public Transit Expansion and Modernization", measureCode: "Prop 7", jurisdictionId: ca.id, electionDate: "2026-11-03", category: "Transportation", shortSummary: "Allocates $6.8 billion from gas tax revenue to expand bus and rail services, add bike infrastructure, and electrify transit fleets.", longSummary: "This measure would dedicate $6.8 billion over 15 years to public transportation expansion including new bus rapid transit lines, rail service extensions, protected bike lanes, and full electrification of transit fleets by 2040.", yesMeans: "Gas tax revenue would fund major public transit expansion and fleet electrification.", noMeans: "Gas tax revenues would continue under current formulas with no additional transit funding.", proArguments: JSON.stringify(["Reduces traffic congestion", "Reduces air pollution", "More equitable transportation"]), conArguments: JSON.stringify(["Diverts road maintenance funding", "Little benefit for rural areas", "Projects often exceed budget"]), sortOrder: 6, topicIds: [transportation.id, environment.id, economy.id] },
    { title: "Immigration Enforcement and Worker Protection Act", measureCode: "HB 1247", jurisdictionId: tx.id, electionDate: "2026-11-03", category: "Immigration", shortSummary: "Requires all employers with 10+ employees to use E-Verify, increases penalties for wage theft, and creates a state guest worker program.", longSummary: "This bill requires businesses with 10+ employees to use E-Verify, increases penalties for wage theft regardless of immigration status, and creates a state-administered temporary guest worker program for agriculture and construction.", yesMeans: "Employers must verify eligibility, face stronger wage theft penalties, and can use a new guest worker program.", noMeans: "Current employment verification and labor protections would remain unchanged.", proArguments: JSON.stringify(["Protects workers from unfair competition", "Addresses labor shortages", "Stronger wage theft penalties"]), conArguments: JSON.stringify(["Burdens small businesses", "Increases agriculture costs", "Hard to administer"]), sortOrder: 7, topicIds: [immigration.id, economy.id, civilRights.id] },
    { title: "Universal Pre-K Education Expansion", measureCode: "Prop 15", jurisdictionId: ca.id, electionDate: "2026-11-03", category: "Education", shortSummary: "Provides free pre-kindergarten for all 3- and 4-year-olds in California, funded by a 1.5% tax on corporate profits over $5 million.", longSummary: "This proposition would establish universal pre-K for all 3- and 4-year-olds, funded by a 1.5% surcharge on corporate profits exceeding $5 million annually, expected to generate approximately $3 billion per year.", yesMeans: "All 3- and 4-year-olds get free pre-K, funded by a tax on large corporate profits.", noMeans: "Current pre-K programs continue, no new corporate tax.", proArguments: JSON.stringify(["Early education improves long-term outcomes", "Helps working families", "Only taxes large corporations"]), conArguments: JSON.stringify(["May reduce business investment", "Hard to hire enough teachers", "Some prefer private education"]), sortOrder: 8, topicIds: [education.id, economy.id] },
  ];

  for (const m of measures) {
    const { topicIds, ...data } = m;
    const created = await prisma.ballotMeasure.create({ data });
    for (const tid of topicIds) {
      await prisma.measureTopic.create({ data: { measureId: created.id, topicId: tid } });
    }
  }

  // === CANDIDATES ===
  const candidates = [
    { name: "Maria Santos", office: "U.S. Senate", party: "Democratic", jurisdictionId: ca.id, shortSummary: "Former mayor and housing advocate running on affordable housing, climate action, and healthcare expansion.", longSummary: "Maria Santos served as mayor for 8 years, overseeing 5,000 affordable housing units and the city's first climate action plan. Her Senate campaign focuses on federal housing investment, expanding the ACA, and aggressive climate legislation.", electionDate: "2026-11-03", sortOrder: 1, topicIds: [housing.id, healthcare.id, environment.id], stances: [{ topic: "Housing", position: "Build more, faster", summary: "Supports $50B federal affordable housing investment and zoning reform" }, { topic: "Healthcare", position: "Expand coverage", summary: "Wants to add a public option to the ACA and lower prescription drug costs" }, { topic: "Climate", position: "Aggressive action", summary: "Supports net-zero emissions by 2040 and major green infrastructure investment" }] },
    { name: "James Whitfield", office: "U.S. Senate", party: "Republican", jurisdictionId: ca.id, shortSummary: "Business executive and veteran focused on fiscal responsibility, border security, and economic growth.", longSummary: "James Whitfield is a retired Army colonel and tech CEO. His campaign emphasizes reducing the national debt, strengthening border security, and supporting small businesses through tax reform.", electionDate: "2026-11-03", sortOrder: 2, topicIds: [economy.id, safety.id, immigration.id], stances: [{ topic: "Economy", position: "Cut spending, cut taxes", summary: "Proposes reducing corporate tax rate and cutting non-essential spending by 10%" }, { topic: "Immigration", position: "Secure the border first", summary: "Supports border infrastructure before pathway discussions" }, { topic: "National Security", position: "Peace through strength", summary: "Increase defense spending and invest in cybersecurity" }] },
    { name: "Priya Patel", office: "Governor", party: "Democratic", jurisdictionId: nc.id, shortSummary: "State legislator and education reformer running on public schools, healthcare access, and clean energy jobs.", longSummary: "Priya Patel has served in the NC General Assembly for 12 years, chairing the Education Committee. Her campaign focuses on clean energy manufacturing, fully funding public schools, and expanding rural healthcare.", electionDate: "2026-11-03", sortOrder: 3, topicIds: [education.id, healthcare.id, environment.id], stances: [{ topic: "Education", position: "Fully fund public schools", summary: "Raise teacher pay to national average and fund universal pre-K" }, { topic: "Healthcare", position: "Expand Medicaid", summary: "Complete Medicaid expansion and increase rural hospital funding" }, { topic: "Clean Energy", position: "Jobs-first transition", summary: "Incentives for clean energy manufacturing and workforce training" }] },
    { name: "Robert Chen", office: "Governor", party: "Republican", jurisdictionId: nc.id, shortSummary: "Small business owner and county commissioner focused on lower taxes, school choice, and public safety.", longSummary: "Robert Chen built a restaurant chain and served as county commissioner for 6 years, cutting the budget by 8%. His campaign emphasizes reducing regulations, expanding school choice, and supporting law enforcement.", electionDate: "2026-11-03", sortOrder: 4, topicIds: [economy.id, education.id, safety.id], stances: [{ topic: "Economy", position: "Less regulation, lower taxes", summary: "Cut state business regulations by 25% and reduce income tax" }, { topic: "Education", position: "Expand school choice", summary: "Universal education savings accounts for school choice" }, { topic: "Public Safety", position: "Back the badge", summary: "Increase law enforcement funding and oppose bail reform" }] },
    { name: "Angela Morrison", office: "U.S. House, District 9", party: "Democratic", jurisdictionId: nc.id, shortSummary: "Civil rights attorney focused on voting rights, criminal justice reform, and tech equity.", longSummary: "Angela Morrison spent 15 years as a civil rights attorney on voting rights and police accountability cases. She founded a legal services nonprofit. Her campaign centers on voting access, criminal justice reform, and closing the digital divide.", electionDate: "2026-11-03", sortOrder: 5, topicIds: [civilRights.id, safety.id, tech.id], stances: [{ topic: "Voting Rights", position: "Protect and expand access", summary: "Federal voting rights legislation and automatic voter registration" }, { topic: "Criminal Justice", position: "Reform the system", summary: "End cash bail, police accountability, sentencing reform" }, { topic: "Technology", position: "Bridge the digital divide", summary: "Federal broadband investment and AI fairness regulations" }] },
    { name: "David Park", office: "State Legislature, District 22", party: "Independent", jurisdictionId: ca.id, shortSummary: "Urban planner and transit advocate running as an independent on housing, transportation, and government reform.", longSummary: "David Park worked as a city planner for 10 years. Running without party affiliation on evidence-based policy, his priorities include housing approval reform, public transit expansion, and ranked-choice voting.", electionDate: "2026-11-03", sortOrder: 6, topicIds: [housing.id, transportation.id], stances: [{ topic: "Housing", position: "Streamline approvals", summary: "Cut housing permit timelines in half through zoning reform" }, { topic: "Transportation", position: "Transit-first", summary: "Dedicated bus lanes and fare-free transit pilot programs" }, { topic: "Government Reform", position: "Fix the system", summary: "Ranked-choice voting and independent redistricting" }] },
  ];

  for (const c of candidates) {
    const { topicIds, stances, ...data } = c;
    const created = await prisma.candidate.create({ data });
    for (const tid of topicIds) {
      await prisma.candidateTopic.create({ data: { candidateId: created.id, topicId: tid } });
    }
    for (const s of stances) {
      await prisma.stance.create({ data: { ...s, candidateId: created.id } });
    }
  }

  console.log("Seeded successfully!");
  console.log(`  ${measures.length} ballot measures`);
  console.log(`  ${candidates.length} candidates`);
  console.log(`  ${topics.length} topics`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
