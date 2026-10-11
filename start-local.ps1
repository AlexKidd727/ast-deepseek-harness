# Local launch of DeepSeek Harness without Docker (Windows).
# NOTE: goal — one entry point for install/build/run from a source checkout.
#
# Examples:
#   .\start-local.ps1
#   .\start-local.ps1 -Mode dev
#   .\start-local.ps1 -Mode web -SkipInstall -NoOpen -- --port 3081
#   .\start-local.ps1 -Mode desktop
#
# Modes:
#   web      — serve already-built Web artifacts (pnpm run start:web)
#   dev      — build if needed, serve, rebuild client bundles on edits (pnpm run dev:web)
#   desktop  — launch Desktop (pnpm run start:desktop / dev:desktop when -DevDesktop)

[CmdletBinding()]
param(
  # web | dev | desktop
  [ValidateSet('web', 'dev', 'desktop')]
  [string] $Mode = 'dev',

  # Skip pnpm install even when node_modules is missing
  [switch] $SkipInstall,

  # For Mode=web: skip the repository build (fails if artifacts are missing)
  [switch] $SkipBuild,

  # For Mode=desktop: use pnpm run dev:desktop (build then launch)
  [switch] $DevDesktop,

  # Forward --no-open to dsh web
  [switch] $NoOpen,

  # Extra args after -- are passed to the launched command (e.g. --port 3081)
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $RemainingArgs
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# NOTE: always run from the repository root (this script's directory).
$RepoRoot = $PSScriptRoot
Set-Location -LiteralPath $RepoRoot

function Write-Step([string] $Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Assert-Command([string] $Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' was not found in PATH. Install Node.js ^22.19 or >=24, then: npm install -g pnpm@11.28.5"
  }
}

# NOTE: load root .env into the process without printing secret values.
function Import-DotEnv([string] $Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  Write-Step "Loading environment from .env"
  Get-Content -LiteralPath $Path -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if ($line.Length -eq 0 -or $line.StartsWith('#')) { return }
    $eq = $line.IndexOf('=')
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $value = $line.Substring($eq + 1).Trim()
    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }
    if ($key.Length -eq 0) { return }
    [Environment]::SetEnvironmentVariable($key, $value, 'Process')
  }
}

function Invoke-Pnpm([string[]] $PnpmArgs) {
  Write-Host ("pnpm " + ($PnpmArgs -join ' ')) -ForegroundColor DarkGray
  & pnpm @PnpmArgs
  if ($LASTEXITCODE -ne 0) {
    throw "pnpm exited with code $LASTEXITCODE"
  }
}

Assert-Command 'node'
Assert-Command 'pnpm'

$nodeVersion = (& node -v).Trim()
Write-Host "Node $nodeVersion | pnpm $((& pnpm --version).Trim()) | mode=$Mode"

Import-DotEnv (Join-Path $RepoRoot '.env')

if (-not $env:DEEPSEEK_API_KEY) {
  Write-Host ""
  Write-Host "DEEPSEEK_API_KEY is not set. Official DeepSeek routes need it in the environment or repo-root .env." -ForegroundColor Yellow
  Write-Host "Local OpenAI-compatible models can be configured in the Web UI / cordis patch without this key." -ForegroundColor Yellow
}

# NOTE: a filtered `pnpm install --filter ...` leaves root node_modules but
# omits packages such as OpenTelemetry; probe one workspace-linked dependency.
$otelCore = Join-Path $RepoRoot 'packages\telemetry\otel\node_modules\@opentelemetry\core'
$installLooksComplete = (Test-Path -LiteralPath (Join-Path $RepoRoot 'node_modules')) -and (Test-Path -LiteralPath $otelCore)
if (-not $SkipInstall -and -not $installLooksComplete) {
  Write-Step 'pnpm install (full workspace; previous install was missing or incomplete)'
  Invoke-Pnpm @('install')
} elseif (-not $SkipInstall) {
  Write-Host "Dependencies look present; skipping install (pass a clean tree or delete node_modules to force)." -ForegroundColor DarkGray
}

# Strip a leading "--" used to separate script switches from app flags.
$appArgs = @($RemainingArgs)
if ($appArgs.Count -gt 0 -and $appArgs[0] -eq '--') {
  $appArgs = @($appArgs | Select-Object -Skip 1)
}
if ($NoOpen) {
  $appArgs = @('--no-open') + $appArgs
}

switch ($Mode) {
  'dev' {
    # NOTE: dev:web builds first, then serves and watches client bundles.
    Write-Step 'Starting Web in development mode (build + serve + watch)'
    Write-Host 'Default UI: http://127.0.0.1:3080' -ForegroundColor Green
    Invoke-Pnpm (@('run', 'dev:web') + $appArgs)
  }
  'web' {
    if (-not $SkipBuild) {
      Write-Step 'pnpm run build (needed for start:web)'
      Invoke-Pnpm @('run', 'build')
    } else {
      Write-Host 'SkipBuild set; expecting existing build artifacts.' -ForegroundColor DarkGray
    }
    Write-Step 'Starting Web from built artifacts (pnpm run start:web)'
    Write-Host 'Default UI: http://127.0.0.1:3080' -ForegroundColor Green
    Invoke-Pnpm (@('run', 'start:web') + $appArgs)
  }
  'desktop' {
    if ($DevDesktop) {
      Write-Step 'Starting Desktop in development mode (build + launch)'
      Invoke-Pnpm (@('run', 'dev:desktop') + $appArgs)
    } else {
      if (-not $SkipBuild) {
        Write-Step 'pnpm run build (needed for start:desktop)'
        Invoke-Pnpm @('run', 'build')
      }
      Write-Step 'Starting Desktop from built artifacts'
      Invoke-Pnpm (@('run', 'start:desktop') + $appArgs)
    }
  }
}
