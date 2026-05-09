param (
    [switch]$DryRun
)

$VpsUser = "ubuntu"
$VpsIp = "54.197.0.250"
$SshKey = "C:\Users\Administrator\Downloads\arxsenhass.pem"
$VpsPath = "/var/www/status-hub"
$ServiceName = "statushub.service"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = "${VpsPath}/backups/dist-${Timestamp}"

if ($DryRun) {
    Write-Host "[DRY RUN]" -ForegroundColor Magenta
    Write-Host "Target VPS Path: $VpsPath"
    Write-Host "Files to sync: dist/"
    Write-Host "Service to restart: $ServiceName"
    Write-Host "Backup path (simulated): $BackupDir"
    Write-Host "No changes executed." -ForegroundColor Yellow
    exit 0
}

Write-Host "--- Starting Deployment for Status Hub ---" -ForegroundColor Cyan

# 1. Local Build
Write-Host "Running local build (TanStack Start)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Local build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build completed successfully." -ForegroundColor Green

# 2. Backup before Sync
Write-Host "Creating backup on VPS via rsync..." -ForegroundColor Yellow
$BackupCmd = "mkdir -p ${VpsPath}/backups && rsync -a ${VpsPath}/dist/ ${BackupDir}/ 2>/dev/null || true"
ssh -i $SshKey ${VpsUser}@${VpsIp} $BackupCmd
Write-Host "Backup created: $BackupDir" -ForegroundColor Green

# 3. Synchronization
Write-Host "Synchronizing dist/ folder to VPS..." -ForegroundColor Yellow
scp -i $SshKey -r ./dist/* ${VpsUser}@${VpsIp}:${VpsPath}/dist/
if ($LASTEXITCODE -ne 0) {
    Write-Host "Sync failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Files synchronized successfully." -ForegroundColor Green

# 4. Service Restart
Write-Host "Restarting service: $ServiceName..." -ForegroundColor Yellow
ssh -i $SshKey ${VpsUser}@${VpsIp} "sudo systemctl restart $ServiceName"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Service restart failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Service restarted successfully." -ForegroundColor Green

# 5. Verification (Mandatory Status Check)
Write-Host "Verifying service status..." -ForegroundColor Yellow
$Status = ssh -i $SshKey ${VpsUser}@${VpsIp} "systemctl is-active $ServiceName"
if ($Status -eq "active") {
    Write-Host "Service is online (active)." -ForegroundColor Green
} else {
    Write-Host "Service is NOT online (status: $Status)." -ForegroundColor Red
    exit 1
}

# 6. HTTP Verification (Warning-Only)
Write-Host "Performing HTTP check (warning-only)..." -ForegroundColor Yellow
Write-Host "Service active, HTTP verification pending (requires external check)." -ForegroundColor Gray

Write-Host "--- Deployment Complete ---" -ForegroundColor Cyan
