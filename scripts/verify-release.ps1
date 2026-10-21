param(
  [string]$ExtractDirectory = 'work/release-validation/bear-20261010T052706Z',
  [string]$ReportPath = 'evidence/current/bear/release-verification.json'
)
$ErrorActionPreference = 'Stop'
$releaseRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$extractRoot = [IO.Path]::GetFullPath((Join-Path $releaseRoot $ExtractDirectory))
$reportFile = [IO.Path]::GetFullPath((Join-Path $releaseRoot $ReportPath))
if (-not $extractRoot.StartsWith((Join-Path $releaseRoot 'work/release-validation') + [IO.Path]::DirectorySeparatorChar)) { throw 'Extraction must stay inside work/release-validation' }
if (-not $reportFile.StartsWith((Join-Path $releaseRoot 'evidence') + [IO.Path]::DirectorySeparatorChar)) { throw 'Report must stay inside evidence' }
if (Test-Path -LiteralPath $extractRoot) { throw 'Extraction directory already exists; refusing to overwrite' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
function Get-BytesHash([byte[]]$bytes) { [Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes)).ToLowerInvariant() }
function Get-EntryBytes($entry) {
  $stream = $entry.Open()
  $memory = [IO.MemoryStream]::new()
  try { $stream.CopyTo($memory); return ,$memory.ToArray() } finally { $stream.Dispose(); $memory.Dispose() }
}
$summary = Get-Content -LiteralPath (Join-Path $releaseRoot 'dist/RELEASE-MANIFEST.json') -Raw | ConvertFrom-Json
$serve = Get-Content -LiteralPath (Join-Path $releaseRoot 'scripts/serve.mjs') -Raw
$allowlist = [regex]::Match($serve, 'const runtimeFiles = new Set\(\[([\s\S]*?)\]\);')
if (-not $allowlist.Success) { throw 'Cannot find explicit public runtime allowlist' }
$webAllowed = @([regex]::Matches($allowlist.Groups[1].Value, "'([^']+)'") | ForEach-Object { $_.Groups[1].Value }) + 'RELEASE-MANIFEST.json'
$wxAllowed = @('game.js', 'game.json', 'project.config.json', 'audio.js', 'core/bundle.js', 'illustrations/game.js', 'illustrations/hero-cards-v1.png', 'RELEASE-MANIFEST.json')
$wxAllowed += @('attack', 'bgm-fire', 'bgm-forest', 'bgm-sand', 'bgm-snow', 'bgm-temple', 'bgm-water', 'boss', 'click', 'dash', 'hit', 'hurt', 'kill', 'level', 'lose', 'pickup', 'win') | ForEach-Object { "assets/audio/$_.wav" }
$channels = @()
foreach ($channel in @('web', 'wechatGame')) {
  $metadata = $summary.$channel
  $folder = if ($channel -eq 'web') { 'web' } else { 'wechat-game' }
  $allowed = if ($channel -eq 'web') { $webAllowed } else { $wxAllowed }
  $zipFile = [IO.Path]::GetFullPath((Join-Path $releaseRoot $metadata.zip))
  if (-not $zipFile.StartsWith((Join-Path $releaseRoot 'dist') + [IO.Path]::DirectorySeparatorChar)) { throw 'Unexpected archive path' }
  $archive = [IO.Compression.ZipFile]::OpenRead($zipFile)
  $failures = [Collections.Generic.List[string]]::new()
  $forbidden = [Collections.Generic.List[string]]::new()
  $entries = @{}
  try {
    foreach ($entry in $archive.Entries) {
      $name = $entry.FullName -replace '^\./', ''
      if (-not $name -or $name -eq '.') { continue }
      if ($name -match '(^/|\\|:|(^|/)\.\.(/|$))') { $forbidden.Add('unsafe archive path'); continue }
      if ($name.EndsWith('/')) { continue }
      if ($entries.ContainsKey($name)) { $failures.Add("duplicate entry: $name"); continue }
      $entries[$name] = $entry
      if ($name -notin $allowed) { $forbidden.Add($name) }
    }
    $names = @($entries.Keys | Sort-Object)
    $manifestMatches = -not (Compare-Object $names @($metadata.files | Sort-Object))
    $allowlistMatches = -not (Compare-Object $names @($allowed | Sort-Object))
    $inner = [Text.Encoding]::UTF8.GetString((Get-EntryBytes $entries['RELEASE-MANIFEST.json'])) | ConvertFrom-Json
    $innerMatches = -not (Compare-Object $names @($inner.included | Sort-Object))
    if ($inner.debugEnabled -ne $false -or $inner.channel -ne $folder) { $failures.Add('invalid internal manifest boundary') }
    foreach ($name in $names) {
      $bytes = Get-EntryBytes $entries[$name]
      $hash = Get-BytesHash $bytes
      $stageFile = Join-Path $releaseRoot "work/release-staging/$folder/$name"
      if (-not (Test-Path -LiteralPath $stageFile) -or (Get-FileHash -LiteralPath $stageFile -Algorithm SHA256).Hash.ToLowerInvariant() -ne $hash) { $failures.Add("staging differs: $name") }
      if ($name -match '\.(js|json|html|svg)$') {
        $text = [Text.Encoding]::UTF8.GetString($bytes)
        if ($text -match '(?i)([a-z]:[/\\]Users[/\\]|\.codex[/\\]|generated_images[/\\]|BEGIN [A-Z ]*PRIVATE KEY|sk-[A-Za-z0-9]{20,})') { $failures.Add("private provenance or credential marker: $name") }
      }
      if ($name -eq 'RELEASE-MANIFEST.json') { continue }
      $sourceFolder = if ($channel -eq 'web') { 'prototype-2d' } else { 'wechat-game' }
      $sourceFile = Join-Path $releaseRoot "$sourceFolder/$name"
      if ($channel -eq 'web' -and $name -match '^assets/enemy-(tiger|bear|bull|wolf)-battle-v1-frames\.json$') {
        $original = Get-Content -LiteralPath $sourceFile -Raw | ConvertFrom-Json
        $public = [Text.Encoding]::UTF8.GetString($bytes) | ConvertFrom-Json
        $fields = @('size', 'referenceBodyHeight', 'previewRootXs', 'previewBaselines', 'states', 'sourceRects')
        if (Compare-Object @($public.PSObject.Properties.Name | Sort-Object) @($fields | Sort-Object)) { $failures.Add("unexpected public contract fields: $name") }
        foreach ($field in $fields) {
          if ((ConvertTo-Json -InputObject $original.$field -Depth 30 -Compress) -cne (ConvertTo-Json -InputObject $public.$field -Depth 30 -Compress)) { $failures.Add("runtime contract changed: $name/$field") }
        }
      } elseif ($channel -eq 'web' -and $name -eq 'native-app.js') {
        $expected = (Get-Content -LiteralPath $sourceFile -Raw) -replace 'debug\s*:\s*[^,]+(?=,audio)', 'debug:false'
        if ([Text.Encoding]::UTF8.GetString($bytes) -cne $expected -or $expected -notmatch 'debug\s*:\s*false\b') { $failures.Add('release debug not disabled or unexpected native-app changes') }
      } elseif ((Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash.ToLowerInvariant() -ne $hash) { $failures.Add("runtime source differs: $name") }
      if ($name -eq 'project.config.json' -and ($text | ConvertFrom-Json).appid -ne 'touristappid') { $failures.Add('unexpected publisher AppID') }
    }
    $bytesMatch = (Get-Item -LiteralPath $zipFile).Length -eq $metadata.bytes
    $zipHash = (Get-FileHash -LiteralPath $zipFile -Algorithm SHA256).Hash.ToLowerInvariant()
    $hashMatches = $zipHash -eq $metadata.sha256
    $pass = $manifestMatches -and $innerMatches -and $allowlistMatches -and $bytesMatch -and $hashMatches -and $forbidden.Count -eq 0 -and $failures.Count -eq 0
    $channels += [pscustomobject]@{ channel=$channel; zip=$metadata.zip; bytes=$metadata.bytes; sha256=$zipHash; entries=$names.Count; expectedEntries=$allowed.Count; manifestMatches=$manifestMatches; internalManifestMatches=$innerMatches; allowlistMatches=$allowlistMatches; bytesMatch=$bytesMatch; hashMatches=$hashMatches; forbidden=@($forbidden); contentFailures=@($failures); result= $(if ($pass) { 'PASS' } else { 'FAIL' }) }
  } finally { $archive.Dispose() }
}
$passed = @($channels | Where-Object { $_.result -ne 'PASS' }).Count -eq 0
if ($passed) {
  New-Item -ItemType Directory -Path $extractRoot | Out-Null
  foreach ($channel in @('web', 'wechatGame')) {
    $folder = if ($channel -eq 'web') { 'web' } else { 'wechat-game' }
    [IO.Compression.ZipFile]::ExtractToDirectory((Join-Path $releaseRoot $summary.$channel.zip), (Join-Path $extractRoot $folder))
  }
}
$report = [pscustomobject]@{
  generatedAt=[DateTime]::UtcNow.ToString('o'); result=$(if ($passed) { 'PASS' } else { 'FAIL' }); scope='Local candidate archive content verification; browser and public-network acceptance are separate'; channels=$channels
  extractedForBrowser=$passed; extractDirectory=$ExtractDirectory; sourceProvenanceRetained=$true; publicContractsRuntimeOnly=$passed; deployed=$false
}
New-Item -ItemType Directory -Path (Split-Path -Parent $reportFile) -Force | Out-Null
$serialized = $report | ConvertTo-Json -Depth 30
[IO.File]::WriteAllText($reportFile, $serialized + [Environment]::NewLine)
$serialized
if (-not $passed) { exit 1 }
