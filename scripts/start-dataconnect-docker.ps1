$ErrorActionPreference = 'Stop'
$utf8Encoding = New-Object System.Text.UTF8Encoding $false
[Console]::OutputEncoding = $utf8Encoding
$OutputEncoding = $utf8Encoding

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$containerName = 'money-rank-dataconnect'
$existingContainer = docker ps -a `
  --filter "name=^/$containerName$" `
  --format '{{.Names}}'

if ($LASTEXITCODE -ne 0) {
  throw 'O Docker Desktop não está disponível.'
}

if ($existingContainer -eq $containerName) {
  $runningContainer = docker ps `
    --filter "name=^/$containerName$" `
    --format '{{.Names}}'

  if ($runningContainer -eq $containerName) {
    Write-Host 'O emulador SQL Connect já está ativo no Docker.'
    Write-Host 'Use Ctrl+C para sair da visualização dos logs.'
    docker logs --follow $containerName
    exit $LASTEXITCODE
  }

  docker rm $containerName | Out-Null
}

$mountPath = "${projectRoot}:/workspace"

Write-Host 'Iniciando o Firebase SQL Connect no Docker...'
Write-Host 'O primeiro início pode levar alguns minutos para baixar o Firebase CLI.'
Write-Host 'Depois de "All emulators ready", mantenha este terminal aberto.'

docker run `
  --rm `
  --name $containerName `
  --publish '9399:9400' `
  --volume $mountPath `
  --volume 'money-rank-firebase-cache:/root/.cache/firebase' `
  --volume 'money-rank-npm-cache:/root/.npm' `
  --workdir '/workspace' `
  'node:24-bookworm-slim' `
  sh -lc `
  'node /workspace/scripts/dataconnect-docker-proxy.mjs & exec npx -y firebase-tools@latest emulators:start --only dataconnect --project demo-money-rank'

exit $LASTEXITCODE
