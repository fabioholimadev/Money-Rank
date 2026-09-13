param(
    [string]$ProjectId = "money-rank",
    [switch]$FullFirebaseStack
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
$services = @("dataconnect")
$ports = @(9399)
$nodeVersion = "22"
$firebaseToolsVersion = "15.30.0"

if ($FullFirebaseStack) {
    $services += @("functions", "storage")
    $ports += @(5001, 9199)

    if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
        throw @"
O emulador do Firebase Storage exige Java, mas o comando 'java' nao foi encontrado.
Instale um JDK compativel, abra um novo terminal e repita com -FullFirebaseStack.
Para o backend HTTP atual, execute o script sem esse parametro.
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
        Write-Host "Gemini local sem chave: fallback cientifico ativado."
    }
}

$activePorts = @($ports | Where-Object { Test-LocalPort -Port $_ })
if ($activePorts.Count -eq $ports.Count) {
    Write-Host "Os emuladores solicitados ja estao ativos."
    exit 0
}

if ($activePorts.Count -gt 0) {
    throw "O ambiente local esta parcialmente ativo nas portas: $($activePorts -join ', '). Encerre os processos antigos e tente novamente."
}

Set-Location $repositoryRoot
$serviceList = $services -join ","
Write-Host "Iniciando emuladores Firebase: $serviceList"
Write-Host "Usando Node $nodeVersion isolado e Firebase CLI $firebaseToolsVersion."

$previousNodeOptions = $env:NODE_OPTIONS
try {
    $env:NODE_OPTIONS = "--max-old-space-size=4096"
    & npx -y `
        -p "node@$nodeVersion" `
        -p "firebase-tools@$firebaseToolsVersion" `
        firebase emulators:start `
        --only $serviceList `
        --project $ProjectId

    if ($LASTEXITCODE -ne 0) {
        throw "Os emuladores Firebase encerraram com o codigo $LASTEXITCODE."
    }
} finally {
    $env:NODE_OPTIONS = $previousNodeOptions
}
