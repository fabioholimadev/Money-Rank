param(
    [string]$ProjectId = "money-rank"
)

$ErrorActionPreference = "Stop"

function Test-LocalPort {
    param([int]$Port)

    return [bool](
        Get-NetTCPConnection `
            -LocalPort $Port `
            -State Listen `
            -ErrorAction SilentlyContinue
    )
}

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$dataConnectRunning = Test-LocalPort -Port 9399
$functionsRunning = Test-LocalPort -Port 5001

if ($dataConnectRunning -and $functionsRunning) {
    Write-Host "Capi Bank e serviço de atividades já estão ativos."
    exit 0
}

if ($dataConnectRunning -or $functionsRunning) {
    throw @"
O ambiente local está parcialmente ativo.
Encerre o terminal que mantém o emulador aberto e execute novamente este script.
O Money Rank precisa iniciar Capi Bank e Functions juntos para evitar falhas nas atividades.
"@
}

$functionsDirectory = Join-Path $repositoryRoot "functions"
$localEnvironmentPath = Join-Path $functionsDirectory ".env.local"
$localSecretsPath = Join-Path $functionsDirectory ".secret.local"

if (-not (Test-Path $localEnvironmentPath)) {
    Set-Content `
        -LiteralPath $localEnvironmentPath `
        -Value "GEMINI_MODEL=gemini-3.6-flash" `
        -Encoding Ascii
}

if (-not (Test-Path $localSecretsPath)) {
    Set-Content `
        -LiteralPath $localSecretsPath `
        -Value "GEMINI_API_KEY=local-fallback" `
        -Encoding Ascii
    Write-Host "Gemini local sem chave: fallback científico ativado."
}

Set-Location $repositoryRoot
Write-Host "Iniciando Capi Bank e serviço seguro de atividades..."
npx -y firebase-tools@latest emulators:start `
    --only dataconnect,functions `
    --project $ProjectId
