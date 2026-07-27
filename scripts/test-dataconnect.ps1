$ErrorActionPreference = 'Stop'
$utf8Encoding = New-Object System.Text.UTF8Encoding $false
[Console]::OutputEncoding = $utf8Encoding
$OutputEncoding = $utf8Encoding

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$debugLogPath = Join-Path $projectRoot 'dataconnect-debug.log'

Push-Location $projectRoot

try {
  Write-Host 'Validando o Firebase SQL Connect no emulador local...'

  & npx -y firebase-tools@latest `
    emulators:exec `
    --only dataconnect `
    --project demo-money-rank `
    'node --version'

  $emulatorExitCode = $LASTEXITCODE

  if ($emulatorExitCode -ne 0) {
    throw "O emulador encerrou com o código $emulatorExitCode."
  }

  if (-not (Test-Path -LiteralPath $debugLogPath)) {
    throw 'O emulador não gerou o arquivo dataconnect-debug.log.'
  }

  $debugLog = Get-Content -Raw -Encoding utf8 -LiteralPath $debugLogPath
  $errorPatterns = @(
    'Errors:',
    'Could not load sources',
    'connector ".+" has errors'
  )

  foreach ($errorPattern in $errorPatterns) {
    if ($debugLog -match $errorPattern) {
      throw "O log do SQL Connect contém erro de compilação: $errorPattern"
    }
  }

  if ($debugLog -notmatch 'ConfigureEmulator successed') {
    throw 'O emulador não confirmou o carregamento do serviço Money Rank.'
  }

  Write-Host 'SQL Connect validado: esquema, relacoes e operacoes carregados.'
} finally {
  Pop-Location
}
