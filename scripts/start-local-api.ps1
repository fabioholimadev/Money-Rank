param(
    [switch]$InstallDependencies
)

$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$apiDirectory = Join-Path $repositoryRoot "backend\render-api"
$environmentExample = Join-Path $apiDirectory ".env.example"
$environmentLocal = Join-Path $apiDirectory ".env.local"

if (-not (Test-Path -LiteralPath $environmentLocal)) {
    Copy-Item -LiteralPath $environmentExample -Destination $environmentLocal
    Write-Host "Criado backend/render-api/.env.local com configuracao segura para o emulador."
}

Push-Location $apiDirectory
try {
    if ($InstallDependencies -or -not (Test-Path -LiteralPath "node_modules")) {
        npm ci
        if ($LASTEXITCODE -ne 0) {
            throw "Falha ao instalar as dependencias da API."
        }
    }

    node --env-file=.env.local server.mjs
    if ($LASTEXITCODE -ne 0) {
        throw "A API encerrou com o codigo $LASTEXITCODE."
    }
} finally {
    Pop-Location
}
