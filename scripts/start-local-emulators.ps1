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
$storageRunning = Test-LocalPort -Port 9199

if ($dataConnectRunning -and $functionsRunning -and $storageRunning) {
    Write-Host "Capi Bank, Functions e Storage já estão ativos."
    exit 0
}

if ($dataConnectRunning -or $functionsRunning -or $storageRunning) {
    throw @"
O ambiente local está parcialmente ativo.
Encerre o terminal que mantém o emulador aberto e execute novamente este script.
O Money Rank precisa iniciar Capi Bank, Functions e Storage juntos para evitar falhas nas atividades.
"@
}

if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    throw @"
O emulador do Firebase Storage exige Java, mas o comando 'java' não foi encontrado.
Instale um JDK compatível com a Firebase CLI, abra um novo terminal e execute este script novamente.
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
Write-Host "Iniciando Capi Bank, serviço seguro de atividades e Storage..."
npx -y firebase-tools@latest emulators:start `
    --only dataconnect,functions,storage `
    --project $ProjectId
