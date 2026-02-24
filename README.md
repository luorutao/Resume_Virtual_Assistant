# Rutao Luo — Personal Portfolio

A static personal website built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS**, deployed to **Azure Static Web Apps** (free tier, global CDN).

## Live site

After deployment: `https://<your-app>.azurestaticapps.net`

---

## Local Development

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 22 | `brew install node` |
| npm | ≥ 10 | bundled with Node |
| uv (optional) | any | `brew install uv` (for resume regeneration) |

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 15.1.0
  - Local:   http://localhost:3000
  - Network: http://192.168.x.x:3000
✓ Ready in ~900ms
```

Open **http://localhost:3000** in your browser.

**What to verify:**
- ✅ Homepage loads with name, title, stats strip
- ✅ Experience section renders all 6 roles; click any to expand
- ✅ Skills section shows 5 skill groups with tags
- ✅ Education & Certifications section renders
- ✅ Publications section shows 6+ papers
- ✅ Contact section shows email + social buttons
- ✅ "Download Resume" button downloads `Resume_Rutao_Luo.pdf`
- ✅ Light/dark mode toggle works (top-right sun/moon icon)
- ✅ No red console errors

### 3. Build static export

```bash
npm run build
```

Output goes to `./out/`. Open `./out/index.html` in a browser to verify the static build.

---

## Resume Data Pipeline

Resume content lives in `src/data/resume.json`. To regenerate it from the source PDF:

### Requirements

```bash
brew install uv  # Python package runner (no venv needed)
```

### Run

```bash
npm run generate:resume
```

This reads `./resume_sources/Resume_Rutao_Luo.pdf`, extracts text via `pdfplumber`, parses it into structured JSON, and writes `./src/data/resume.json`.

**Fallback:** If the PDF is missing, place a plain-text `resume.md` in the project root and re-run.

**What gets preserved:** If `resume.json` already exists, `personal.linkedin`, `personal.github`, and other fields not found by the parser are kept from the existing file.

### Update resume

1. Copy new PDF → `./resume_sources/Resume_Rutao_Luo.pdf`
2. Run `npm run generate:resume`
3. Review `src/data/resume.json`
4. Commit + push → GitHub Actions deploys automatically

---

## Azure Deployment

### Architecture

```
GitHub → GitHub Actions → Azure Static Web Apps (free tier)
                          ├── Global CDN (40+ edge locations)
                          ├── Free TLS certificate
                          ├── Custom domain support
                          └── PR preview environments
```

### Cost estimate

| Resource | Tier | Monthly Cost |
|----------|------|-------------|
| Azure Static Web Apps | Free | **$0** |
| Bandwidth (up to 100 GB) | Free | **$0** |
| Custom domain TLS | Free | **$0** |
| **Total** | | **$0/month** |

> The Free tier supports one production environment, unlimited PR previews, 100 GB/month bandwidth, and a custom domain with free SSL.

---

### Option A: Auto-provisioned (recommended for first deploy)

Azure Static Web Apps can self-provision when you connect your GitHub repo directly from the Azure Portal:

1. **Azure Portal** → Create a resource → **Static Web App**
2. Fill in:
   - Name: `rutao-portfolio-prod`
   - Plan: **Free**
   - Region: East US 2
   - Source: **GitHub** → authenticate → select repo + branch `main`
   - Build details:
     - App location: `/`
     - Output location: `out`
     - API location: (leave empty)
3. Click **Review + Create**

Azure will commit a GitHub Actions workflow to your repo automatically.

---

### Option B: Terraform (infra-as-code)

#### Prerequisites

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
brew install azure-cli
```

#### Authenticate

```bash
az login
az account set --subscription "<your-subscription-id>"
```

#### Configure

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set github_repo_url and optionally site_custom_domain
```

> `terraform.tfvars` is git-ignored — never commit it.

```hcl
# terraform.tfvars (example)
project_name    = "rutao-portfolio"
environment     = "prod"
location        = "eastus2"
github_repo_url = "https://github.com/YOUR_USERNAME/portfolio"
# site_custom_domain = "rutaoluo.com"  # optional
```

#### Deploy

```bash
terraform init
terraform plan
terraform apply
```

#### Get the deployment token

```bash
terraform output -raw api_key
```

Copy this value — you'll need it for GitHub Actions in the next step.

---

### GitHub Actions Setup

After provisioning (either way), set one secret in your GitHub repo:

1. Go to **GitHub repo → Settings → Secrets and variables → Actions**
2. Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN` = the deployment token from Terraform output or Azure Portal

The workflow at `.github/workflows/deploy.yml` will now:
1. Run `npm ci && npm run build` on every push to `main`
2. Upload `./out` to Azure Static Web Apps
3. Serve the site at `https://<name>.azurestaticapps.net`
4. Create a preview URL for every PR (auto-deleted on PR close)

---

### Custom Domain

If you own a domain (e.g. `rutaoluo.com`):

1. Set `site_custom_domain = "rutaoluo.com"` in `terraform.tfvars` and re-apply
   OR go to **Azure Portal → Static Web App → Custom domains → + Add**
2. Add a CNAME record at your DNS provider:
   ```
   CNAME  www    <your-app>.azurestaticapps.net
   ```
3. Azure will auto-issue a free Let's Encrypt TLS certificate

---

## File Tree

```
resume_project/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions: build + deploy to Azure
├── infra/
│   ├── main.tf                     # Terraform: provider + backend
│   ├── variables.tf                # Input variables
│   ├── static_web_app.tf           # Azure Static Web App + custom domain
│   └── outputs.tf                  # Site URL, API key, resource group
├── public/
│   ├── Resume_Rutao_Luo.pdf        # Resume PDF (download button target)
│   └── staticwebapp.config.json    # Azure SWA routing + security headers
├── resume_sources/
│   └── Resume_Rutao_Luo.pdf        # Source PDF for parsing
├── scripts/
│   └── generate-resume.js          # PDF → resume.json pipeline
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout + SEO metadata + ThemeProvider
│   │   └── page.tsx                # Home page (composes all sections)
│   ├── components/
│   │   ├── ThemeProvider.tsx       # next-themes wrapper
│   │   ├── ThemeToggle.tsx         # Light/dark toggle button
│   │   ├── Navbar.tsx              # Sticky responsive navbar
│   │   ├── Hero.tsx                # Name, title, CTA buttons, stats
│   │   ├── Experience.tsx          # Timeline with expandable roles
│   │   ├── Skills.tsx              # Grouped skill tags grid
│   │   ├── Education.tsx           # Degrees + certifications
│   │   ├── Publications.tsx        # Research papers list
│   │   └── Contact.tsx             # Email + socials + download resume
│   ├── data/
│   │   └── resume.json             # Structured resume data (generated)
│   ├── lib/
│   │   └── types.ts                # TypeScript interfaces
│   └── styles/
│       └── globals.css             # Tailwind base + custom utilities
├── next.config.ts                  # Static export config
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server at http://localhost:3000 |
| `npm run build` | Build static export → `./out/` |
| `npm run generate:resume` | Re-parse PDF → update `src/data/resume.json` |
| `npm run lint` | Run ESLint |

---

## Troubleshooting

**`npm run generate:resume` fails with "uv not found"**
```bash
brew install uv
```

**Build fails with TypeScript errors**
```bash
npm run lint
# fix any issues, then re-run npm run build
```

**Site shows blank page on Azure**
- Verify `output_location: out` in the GitHub Actions workflow
- Make sure `next.config.ts` has `output: "export"` and `trailingSlash: true`

**PDF download shows 404**
- Confirm `public/Resume_Rutao_Luo.pdf` exists
- After `npm run build`, check `out/Resume_Rutao_Luo.pdf` exists
