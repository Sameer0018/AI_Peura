export interface Task {
  id: string;
  title: string;
  description?: string;
  timeEstimate: string;
  priority: 'Critical' | 'Important' | 'Good-to-have';
  deliverable: string;
  completed: boolean;
}

export interface Day {
  day: number;
  label: string;
  tasks: Task[];
}

export interface Week {
  week: number;
  title: string;
  focus: string;
  days: Day[];
}

export const ACTION_PLAN_DATA: Week[] = [
  {
    week: 1,
    title: "Foundation",
    focus: "Fix Critical Gaps Before You Promote",
    days: [
      {
        day: 1,
        label: "Monday: Analytics & Tracking",
        tasks: [
          { id: "w1d1t1", title: "Install Meta Pixel on website", timeEstimate: "3 hours", priority: "Critical", deliverable: "Active Pixel status", completed: false },
          { id: "w1d1t2", title: "Set up Google Analytics 4 (GA4)", timeEstimate: "3 hours", priority: "Critical", deliverable: "GA4 dashboard active", completed: false },
          { id: "w1d1t3", title: "Install Google Tag Manager", timeEstimate: "3 hours", priority: "Important", deliverable: "GTM container live", completed: false },
          { id: "w1d1t4", title: "Test pixel firing with Meta Pixel Helper", timeEstimate: "3 hours", priority: "Critical", deliverable: "Green status in extension", completed: false },
          { id: "w1d1t5", title: "Set up conversion events (ATC, Purchase)", timeEstimate: "3 hours", priority: "Critical", deliverable: "Test conversion successful", completed: false },
          { id: "w1d1t6", title: "Install Microsoft Clarity for heatmaps", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "First recording active", completed: false },
          { id: "w1d1t7", title: "Create Google Search Console account", timeEstimate: "3 hours", priority: "Important", deliverable: "Website verified in GSC", completed: false }
        ]
      },
      {
        day: 2,
        label: "Tuesday: Website Emergency Fixes",
        tasks: [
          { id: "w1d2t1", title: "Rewrite homepage hero headline", timeEstimate: "4 hours", priority: "Critical", deliverable: "Before/After screenshot", completed: false },
          { id: "w1d2t2", title: "Add 3 clear CTAs above fold", timeEstimate: "4 hours", priority: "Critical", deliverable: "Mobile view check", completed: false },
          { id: "w1d2t3", title: "Create trust badges bar", timeEstimate: "4 hours", priority: "Important", deliverable: "Design live on home", completed: false },
          { id: "w1d2t4", title: "Add WhatsApp chat button", timeEstimate: "4 hours", priority: "Critical", deliverable: "Test link opens chat", completed: false },
          { id: "w1d2t5", title: "Install Tawk.to live chat widget", timeEstimate: "4 hours", priority: "Good-to-have", deliverable: "Live chat active", completed: false },
          { id: "w1d2t6", title: "Test mobile version - fix elements", timeEstimate: "4 hours", priority: "Critical", deliverable: "Google Lighthouse score > 80", completed: false },
          { id: "w1d2t7", title: "Add 'As Seen On' section", timeEstimate: "4 hours", priority: "Important", deliverable: "Social proof section live", completed: false }
        ]
      },
      {
        day: 3,
        label: "Wednesday: Product Pages Optimization",
        tasks: [
          { id: "w1d3t1", title: "Add size guide to all product pages", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "Size chart visible", completed: false },
          { id: "w1d3t2", title: "Include 'Complete Your Look' section", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Upsell widgets live", completed: false },
          { id: "w1d3t3", title: "Add trust badges to product pages", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Badges below Add to Cart", completed: false },
          { id: "w1d3t4", title: "Write compelling product descriptions", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "5 products fully optimized", completed: false },
          { id: "w1d3t5", title: "Optimize 5 product images", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Compressed & Alt-text added", completed: false },
          { id: "w1d3t6", title: "Add 'Need Help Choosing?' WhatsApp button", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Contextual CTA active", completed: false },
          { id: "w1d3t7", title: "Create comparison chart (Peura vs Lenskart)", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "Chart published on site", completed: false }
        ]
      },
      {
        day: 4,
        label: "Thursday: Trust & Credibility Pages",
        tasks: [
          { id: "w1d4t1", title: "Write About Us page (300 words)", timeEstimate: "3 hours", priority: "Important", deliverable: "Founder story live", completed: false },
          { id: "w1d4t2", title: "Create FAQ page (15+ questions)", timeEstimate: "3 hours", priority: "Critical", deliverable: "FAQ accordions active", completed: false },
          { id: "w1d4t3", title: "Write prominent Return/Exchange policy", timeEstimate: "3 hours", priority: "Critical", deliverable: "Policy link in checkout", completed: false },
          { id: "w1d4t4", title: "Add 'How It Works' section", timeEstimate: "3 hours", priority: "Important", deliverable: "4-step graphic on site", completed: false },
          { id: "w1d4t5", title: "Create 'Quality Promise' page", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "Material specs live", completed: false },
          { id: "w1d4t6", title: "Add contact page", timeEstimate: "3 hours", priority: "Critical", deliverable: "All contact info linked", completed: false },
          { id: "w1d4t7", title: "Link all pages in footer", timeEstimate: "3 hours", priority: "Critical", deliverable: "Footer navigation complete", completed: false }
        ]
      },
      {
        day: 5,
        label: "Friday: Email Marketing Setup",
        tasks: [
          { id: "w1d5t1", title: "Sign up for Mailchimp/MailerLite", timeEstimate: "3 hours", priority: "Critical", deliverable: "Account verified", completed: false },
          { id: "w1d5t2", title: "Create welcome email template", timeEstimate: "3 hours", priority: "Important", deliverable: "Branded template ready", completed: false },
          { id: "w1d5t3", title: "Set up 15% off popup", timeEstimate: "3 hours", priority: "Critical", deliverable: "Live popup on site", completed: false },
          { id: "w1d5t4", title: "Design email signup form", timeEstimate: "3 hours", priority: "Important", deliverable: "Form in footer", completed: false },
          { id: "w1d5t5", title: "Create email signature with branding", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "Personalized signature", completed: false },
          { id: "w1d5t6", title: "Write 3-email welcome sequence", timeEstimate: "3 hours", priority: "Critical", deliverable: "3 emails drafted", completed: false },
          { id: "w1d5t7", title: "Set up automation for welcome series", timeEstimate: "3 hours", priority: "Critical", deliverable: "Automation flow live", completed: false }
        ]
      },
      {
        day: 6,
        label: "Saturday: Instagram Profile Overhaul",
        tasks: [
          { id: "w1d6t1", title: "Rewrite Instagram bio", timeEstimate: "2.5 hours", priority: "Critical", deliverable: "Optimized bio live", completed: false },
          { id: "w1d6t2", title: "Update profile picture (logo)", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Clear logo at scale", completed: false },
          { id: "w1d6t3", title: "Set up Linktree/Beacons", timeEstimate: "2.5 hours", priority: "Critical", deliverable: "4 links active", completed: false },
          { id: "w1d6t4", title: "Create 6 highlight cover designs", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Branded covers on Canva", completed: false },
          { id: "w1d6t5", title: "Organize highlights", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Clean highlight structure", completed: false },
          { id: "w1d6t6", title: "Archive low-quality old posts", timeEstimate: "2.5 hours", priority: "Good-to-have", deliverable: "Clean grid", completed: false },
          { id: "w1d6t7", title: "Pin 3 best-performing posts", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Top grid fixed", completed: false }
        ]
      },
      {
        day: 7,
        label: "Sunday: Content Planning & Week Review",
        tasks: [
          { id: "w1d7t1", title: "Create content calendar template", timeEstimate: "3 hours", priority: "Critical", deliverable: "Google Sheets/Dashboard ready", completed: false },
          { id: "w1d7t2", title: "Plan 30 Reel ideas", timeEstimate: "3 hours", priority: "Important", deliverable: "Hooks & Titles list", completed: false },
          { id: "w1d7t3", title: "Plan 15 post captions", timeEstimate: "3 hours", priority: "Important", deliverable: "Captions doc ready", completed: false },
          { id: "w1d7t4", title: "Create branded Canva template", timeEstimate: "3 hours", priority: "Important", deliverable: "3 variations ready", completed: false },
          { id: "w1d7t5", title: "Set up content folder structure", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "Organized GDrive", completed: false },
          { id: "w1d7t6", title: "Research 50 relevant hashtags", timeEstimate: "3 hours", priority: "Important", deliverable: "Hashtag sheet by size", completed: false },
          { id: "w1d7t7", title: "WEEK 1 REVIEW: Tracking tools check", timeEstimate: "3 hours", priority: "Critical", deliverable: "All Week 1 tasks checked", completed: false }
        ]
      }
    ]
  },
  {
    week: 2,
    title: "Content Creation",
    focus: "Build Content Library Before Promotion",
    days: [
      {
        day: 8,
        label: "Monday: Product Photography",
        tasks: [
          { id: "w2d8t1", title: "Set up DIY photo station", timeEstimate: "4 hours", priority: "Critical", deliverable: "Station photo", completed: false },
          { id: "w2d8t2", title: "Photograph 10 frames (5 angles)", timeEstimate: "4 hours", priority: "Critical", deliverable: "50 raw photos", completed: false },
          { id: "w2d8t3", title: "Edit photos (brightness, compression)", timeEstimate: "4 hours", priority: "Important", deliverable: "50 edited photos", completed: false },
          { id: "w2d8t4", title: "Add watermark/branding", timeEstimate: "4 hours", priority: "Good-to-have", deliverable: "Branded assets", completed: false },
          { id: "w2d8t5", title: "Upload to organized Google Drive", timeEstimate: "4 hours", priority: "Important", deliverable: "GDrive link ready", completed: false },
          { id: "w2d8t6", title: "Create flat lay shots (3 comp)", timeEstimate: "4 hours", priority: "Important", deliverable: "3 hero flatlays", completed: false }
        ]
      },
      {
        day: 9,
        label: "Tuesday: Lifestyle Content Shoot",
        tasks: [
          { id: "w2d9t1", title: "Find model/friend for shoot", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "Shoot scheduled", completed: false },
          { id: "w2d9t2", title: "Shoot 5 frames in 5 contexts", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "25 lifestyle photos", completed: false },
          { id: "w2d9t3", title: "Capture video clips (15-30s)", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "10 raw clips", completed: false },
          { id: "w2d9t4", title: "Get 'putting on glasses' B-roll", timeEstimate: "3.5 hours", priority: "Important", deliverable: "B-roll folder ready", completed: false },
          { id: "w2d9t5", title: "Shoot unboxing video", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Unboxing edit ready", completed: false },
          { id: "w2d9t6", title: "Take customer testimonial video", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Testimonial asset", completed: false }
        ]
      },
      {
        day: 10,
        label: "Wednesday: Reel Batch Day",
        tasks: [
          { id: "w2d10t1", title: "Create Reel #1: Product showcase", timeEstimate: "4 hours", priority: "Critical", deliverable: "Reel 1 export", completed: false },
          { id: "w2d10t2", title: "Create Reel #2: Peura vs Lenskart", timeEstimate: "4 hours", priority: "Critical", deliverable: "Reel 2 export", completed: false },
          { id: "w2d10t3", title: "Create Reel #3: Unboxing", timeEstimate: "4 hours", priority: "Important", deliverable: "Reel 3 export", completed: false },
          { id: "w2d10t4", title: "Create Reel #4: Face shape guide", timeEstimate: "4 hours", priority: "Important", deliverable: "Reel 4 export", completed: false },
          { id: "w2d10t5", title: "Create Reel #5: Transformation", timeEstimate: "4 hours", priority: "Important", deliverable: "Reel 5 export", completed: false },
          { id: "w2d10t6", title: "Schedule all 5 reels", timeEstimate: "4 hours", priority: "Critical", deliverable: "Meta Suite schedule", completed: false },
          { id: "w2d10t7", title: "Write captions for each reel", timeEstimate: "4 hours", priority: "Important", deliverable: "Captions added to schedule", completed: false }
        ]
      },
      {
        day: 11,
        label: "Thursday: Graphics & Educational",
        tasks: [
          { id: "w2d11t1", title: "Design 5 carousel posts on Canva", timeEstimate: "3 hours", priority: "Critical", deliverable: "5 carousels (30 slides)", completed: false },
          { id: "w2d11t2", title: "Create 10 story templates", timeEstimate: "3 hours", priority: "Important", deliverable: "Story kit ready", completed: false },
          { id: "w2d11t3", title: "Design 3 promotional graphics", timeEstimate: "3 hours", priority: "Critical", deliverable: "Sale templates ready", completed: false }
        ]
      },
      {
        day: 12,
        label: "Friday: Website Content Enhancement",
        tasks: [
          { id: "w2d12t1", title: "Write blog post #1: Face Shapes", timeEstimate: "3 hours", priority: "Important", deliverable: "800 word blog live", completed: false },
          { id: "w2d12t2", title: "Write blog post #2: Comparison", timeEstimate: "3 hours", priority: "Important", deliverable: "1000 word blog live", completed: false },
          { id: "w2d12t3", title: "Optimize blogs for SEO", timeEstimate: "3 hours", priority: "Important", deliverable: "Keyword check complete", completed: false },
          { id: "w2d12t4", title: "Add internal links", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "Product links in blogs", completed: false },
          { id: "w2d12t5", title: "Create face shape quiz", timeEstimate: "3 hours", priority: "Critical", deliverable: "Quiz live on Typeform", completed: false },
          { id: "w2d12t6", title: "Embed quiz on homepage", timeEstimate: "3 hours", priority: "Critical", deliverable: "Hero quiz active", completed: false }
        ]
      },
      {
        day: 13,
        label: "Saturday: Review & Social Proof",
        tasks: [
          { id: "w2d13t1", title: "Install review app (Judge.me)", timeEstimate: "2.5 hours", priority: "Critical", deliverable: "Review stars on site", completed: false },
          { id: "w2d13t2", title: "Request reviews from friends/family", timeEstimate: "2.5 hours", priority: "Critical", deliverable: "5 reviews live", completed: false },
          { id: "w2d13t3", title: "Create Google My Business listing", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Listing pending verification", completed: false },
          { id: "w2d13t4", title: "Add business to Facebook", timeEstimate: "2.5 hours", priority: "Important", deliverable: "FB Page complete", completed: false },
          { id: "w2d13t5", title: "Screenshot DM compliments", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Testimonial folder", completed: false },
          { id: "w2d13t6", title: "Create 'Customer Love' highlight", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Highlight active on IG", completed: false }
        ]
      },
      {
        day: 14,
        label: "Sunday: Week 2 Review & Planning",
        tasks: [
          { id: "w2d14t1", title: "Organize all content in folders", timeEstimate: "2 hours", priority: "Important", deliverable: "30+ assets ready", completed: false },
          { id: "w2d14t2", title: "Create posting schedule for Week 3", timeEstimate: "2 hours", priority: "Critical", deliverable: "Week 3 calendar ready", completed: false },
          { id: "w2d14t3", title: "Write 7 captions for next week", timeEstimate: "2 hours", priority: "Important", deliverable: "Captions scheduled", completed: false },
          { id: "w2d14t4", title: "Set up Instagram scheduling", timeEstimate: "2 hours", priority: "Critical", deliverable: "7 posts automated", completed: false },
          { id: "w2d14t5", title: "Prepare hashtag sets", timeEstimate: "2 hours", priority: "Important", deliverable: "Sets ready in notes", completed: false }
        ]
      }
    ]
  },
  {
    week: 3,
    title: "Traffic Generation",
    focus: "Start Getting Eyes on Your Brand",
    days: [
      {
        day: 15,
        label: "Monday: Instagram Launch Day",
        tasks: [
          { id: "w3d15t1", title: "Post Reel #1 (10 AM)", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "Post live", completed: false },
          { id: "w3d15t2", title: "Post carousel (6 PM)", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Post live", completed: false },
          { id: "w3d15t3", title: "Post 7 stories throughout day", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Stories active", completed: false },
          { id: "w3d15t4", title: "Engage with 30 competitor followers", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "30 meaningful comments", completed: false },
          { id: "w3d15t5", title: "Follow 50 target accounts", timeEstimate: "3.5 hours", priority: "Important", deliverable: "50 follows", completed: false },
          { id: "w3d15t6", title: "DM 10 potential customers", timeEstimate: "3.5 hours", priority: "Important", deliverable: "10 outreach DMs", completed: false },
          { id: "w3d15t7", title: "Go live on Instagram (15 min)", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Live session complete", completed: false }
        ]
      },
      {
        day: 16,
        label: "Tuesday: SEO Blitz",
        tasks: [
          { id: "w3d16t1", title: "Submit sitemap to GSC", timeEstimate: "3 hours", priority: "Critical", deliverable: "Sitemap status: Success", completed: false },
          { id: "w3d16t2", title: "Optimize meta titles for 10 products", timeEstimate: "3 hours", priority: "Important", deliverable: "Meta titles updated", completed: false },
          { id: "w3d16t3", title: "Optimize meta descriptions", timeEstimate: "3 hours", priority: "Important", deliverable: "Meta descriptions updated", completed: false },
          { id: "w3d16t4", title: "Add schema markup for products", timeEstimate: "3 hours", priority: "Important", deliverable: "Rich results test pass", completed: false },
          { id: "w3d16t5", title: "Write blog post #3: Buying Guide", timeEstimate: "3 hours", priority: "Important", deliverable: "1200 word guide live", completed: false },
          { id: "w3d16t6", title: "Create Pinterest account & boards", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "5 boards + 20 pins", completed: false }
        ]
      },
      {
        day: 17,
        label: "Wednesday: Influencer Outreach",
        tasks: [
          { id: "w3d17t1", title: "Research 50 micro-influencers", timeEstimate: "4 hours", priority: "Critical", deliverable: "Influencer list (50)", completed: false },
          { id: "w3d17t2", title: "Create outreach template", timeEstimate: "4 hours", priority: "Important", deliverable: "Template ready", completed: false },
          { id: "w3d17t3", title: "DM 30 influencers", timeEstimate: "4 hours", priority: "Critical", deliverable: "30 DMs sent", completed: false },
          { id: "w3d17t4", title: "Create influencer package info", timeEstimate: "4 hours", priority: "Important", deliverable: "Brief PDF ready", completed: false },
          { id: "w3d17t5", title: "Set up tracking sheet", timeEstimate: "4 hours", priority: "Important", deliverable: "Tracking sheet live", completed: false },
          { id: "w3d17t6", title: "Get 3-5 'yes' responses", timeEstimate: "4 hours", priority: "Critical", deliverable: "3 partnerships locked", completed: false }
        ]
      },
      {
        day: 18,
        label: "Thursday: Email List Building",
        tasks: [
          { id: "w3d18t1", title: "Create lead magnet (Style Guide)", timeEstimate: "3 hours", priority: "Critical", deliverable: "10-page PDF ready", completed: false },
          { id: "w3d18t2", title: "Set up FB/IG lead ad", timeEstimate: "3 hours", priority: "Critical", deliverable: "Ad running ($500)", completed: false },
          { id: "w3d18t3", title: "Set up lead automation", timeEstimate: "3 hours", priority: "Critical", deliverable: "Welcome email sync", completed: false },
          { id: "w3d18t4", title: "Collect 50 emails", timeEstimate: "3 hours", priority: "Critical", deliverable: "50 subs in Mailchimp", completed: false }
        ]
      },
      {
        day: 19,
        label: "Friday: Community Engagement",
        tasks: [
          { id: "w3d19t1", title: "Engage with 100 Instagram accounts", timeEstimate: "3.5 hours", priority: "Important", deliverable: "100 comments", completed: false },
          { id: "w3d19t2", title: "Join 5 Facebook groups", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Groups joined", completed: false },
          { id: "w3d19t3", title: "Make 10 valuable comments in groups", timeEstimate: "3.5 hours", priority: "Important", deliverable: "10 group posts", completed: false },
          { id: "w3d19t4", title: "Create 'Tag a friend' post", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Engagement post live", completed: false },
          { id: "w3d19t5", title: "Host Q&A session on stories", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Q&A archive", completed: false }
        ]
      },
      {
        day: 20,
        label: "Saturday: First Ad Campaign Launch",
        tasks: [
          { id: "w3d20t1", title: "Set up Campaign 1: Traffic", timeEstimate: "3 hours", priority: "Critical", deliverable: "Traffic ad live", completed: false },
          { id: "w3d20t2", title: "Set up Ad #2: Retargeting", timeEstimate: "3 hours", priority: "Critical", deliverable: "Retargeting ad live", completed: false },
          { id: "w3d20t3", title: "Define audience: 22-35 Metro", timeEstimate: "3 hours", priority: "Important", deliverable: "Audience saved", completed: false }
        ]
      },
      {
        day: 21,
        label: "Sunday: Analytics Review",
        tasks: [
          { id: "w3d21t1", title: "Check GA: Traffic count", timeEstimate: "2.5 hours", priority: "Critical", deliverable: "500+ visitors report", completed: false },
          { id: "w3d21t2", title: "Check IG: Insights report", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Reach & Profile visits", completed: false },
          { id: "w3d21t3", title: "Review ad performance (CTR, CPC)", timeEstimate: "2.5 hours", priority: "Critical", deliverable: "Ad audit complete", completed: false }
        ]
      }
    ]
  },
  {
    week: 4,
    title: "Conversion & Scale",
    focus: "Turn Traffic into Sales",
    days: [
      {
        day: 22,
        label: "Monday: Conversion Optimization",
        tasks: [
          { id: "w4d22t1", title: "Set up cart abandonment sequence", timeEstimate: "4 hours", priority: "Critical", deliverable: "3 emails active", completed: false },
          { id: "w4d22t2", title: "Install FB Messenger chat", timeEstimate: "4 hours", priority: "Important", deliverable: "Messenger icon active", completed: false },
          { id: "w4d22t3", title: "Create exit-intent popup", timeEstimate: "4 hours", priority: "Critical", deliverable: "Exit offer live", completed: false },
          { id: "w4d22t4", title: "Add countdown timer to home", timeEstimate: "4 hours", priority: "Important", deliverable: "Timer active", completed: false },
          { id: "w4d22t5", title: "Test checkout friction", timeEstimate: "4 hours", priority: "Critical", deliverable: "Friction report + fixes", completed: false }
        ]
      },
      {
        day: 23,
        label: "Tuesday: Launch Promotion",
        tasks: [
          { id: "w4d23t1", title: "Create 'Grand Launch' offer (20% off)", timeEstimate: "3 hours", priority: "Critical", deliverable: "Offer code active", completed: false },
          { id: "w4d23t2", title: "Email entire list (Launch)", timeEstimate: "3 hours", priority: "Critical", deliverable: "Launch email sent", completed: false },
          { id: "w4d23t3", title: "Update homepage hero for offer", timeEstimate: "3 hours", priority: "Critical", deliverable: "Hero updated", completed: false },
          { id: "w4d23t4", title: "Boost launch post (₹1000)", timeEstimate: "3 hours", priority: "Important", deliverable: "Boost active", completed: false }
        ]
      },
      {
        day: 24,
        label: "Wednesday: Launch Consistency",
        tasks: [
          { id: "w4d24t1", title: "Post morning Reel (Order packing)", timeEstimate: "3 hours", priority: "Important", deliverable: "BTS reel live", completed: false },
          { id: "w4d24t2", title: "Post afternoon carousel (Reviews)", timeEstimate: "3 hours", priority: "Important", deliverable: "Social proof post live", completed: false },
          { id: "w4d24t3", title: "Post 10 stories (Urgency)", timeEstimate: "3 hours", priority: "Critical", deliverable: "10 stories active", completed: false },
          { id: "w4d24t4", title: "Share offer in FB groups", timeEstimate: "3 hours", priority: "Important", deliverable: "Group posts done", completed: false }
        ]
      },
      {
        day: 25,
        label: "Thursday: Partnership Execution",
        tasks: [
          { id: "w4d25t1", title: "Send frames to influencers", timeEstimate: "3.5 hours", priority: "Critical", deliverable: "3 packages shipped", completed: false },
          { id: "w4d25t2", title: "Create affiliate program", timeEstimate: "3.5 hours", priority: "Important", deliverable: "Tracking sheet live", completed: false },
          { id: "w4d25t3", title: "Post affiliate opportunity", timeEstimate: "3.5 hours", priority: "Good-to-have", deliverable: "LinkedIn post live", completed: false }
        ]
      },
      {
        day: 26,
        label: "Friday: Customer Experience",
        tasks: [
          { id: "w4d26t1", title: "Set up WhatsApp catalog", timeEstimate: "3 hours", priority: "Critical", deliverable: "Catalog live on WA", completed: false },
          { id: "w4d26t2", title: "Set up automated WA order msgs", timeEstimate: "3 hours", priority: "Important", deliverable: "Order automation live", completed: false },
          { id: "w4d26t3", title: "Design thank you card", timeEstimate: "3 hours", priority: "Important", deliverable: "Print-ready design", completed: false },
          { id: "w4d26t4", title: "Set up post-purchase email (D7)", timeEstimate: "3 hours", priority: "Important", deliverable: "Feedback email live", completed: false }
        ]
      },
      {
        day: 27,
        label: "Saturday: Scale Ad Campaigns",
        tasks: [
          { id: "w4d27t1", title: "Increase best-ad budget (50%)", timeEstimate: "3 hours", priority: "Critical", deliverable: "Budget updated", completed: false },
          { id: "w4d27t2", title: "Launch Google Shopping ads", timeEstimate: "3 hours", priority: "Important", deliverable: "Shopping campaign live", completed: false },
          { id: "w4d27t3", title: "Set up Search ads for 'buy glasses'", timeEstimate: "3 hours", priority: "Important", deliverable: "Search campaign live", completed: false }
        ]
      },
      {
        day: 28,
        label: "Sunday: Referral Program",
        tasks: [
          { id: "w4d28t1", title: "Create referral: Give ₹500, Get ₹500", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Referral page live", completed: false },
          { id: "w4d28t2", title: "Email customers about referral", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Referral email sent", completed: false },
          { id: "w4d28t3", title: "Add referral CTA to footer", timeEstimate: "2.5 hours", priority: "Important", deliverable: "Footer updated", completed: false }
        ]
      },
      {
        day: 29,
        label: "Monday: Content Repurposing",
        tasks: [
          { id: "w4d29t1", title: "Create YouTube channel & upload", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "First YT video live", completed: false },
          { id: "w4d29t2", title: "Convert blogs to YT videos", timeEstimate: "3 hours", priority: "Good-to-have", deliverable: "3 YT videos live", completed: false },
          { id: "w4d29t3", title: "Create LinkedIn company page", timeEstimate: "3 hours", priority: "Important", deliverable: "LI Page complete", completed: false }
        ]
      },
      {
        day: 30,
        label: "Tuesday: 30-Day Review",
        tasks: [
          { id: "w4d30t1", title: "Complete Final Metrics Audit", timeEstimate: "4 hours", priority: "Critical", deliverable: "Month 1 report PDF", completed: false },
          { id: "w4d30t2", title: "Plan Month 2 Priorities", timeEstimate: "4 hours", priority: "Critical", deliverable: "Month 2 roadmap", completed: false }
        ]
      }
    ]
  }
];
