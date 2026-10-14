# Installs the free local voices for the Voice Studio (/admin/audio-test).
# Run once from the project folder in PowerShell:   .\scripts\setup-local-tts.ps1
#
# Everything goes into the git-ignored .tts/ folder (about 1 GB): a Python virtual
# environment with Piper + Kokoro, and the voice models. No account, no API key.
# Needs Python 3.10 or newer ("python" on the PATH). Safe to run again: it skips
# what's already there.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$tts = Join-Path $root ".tts"
$venv = Join-Path $tts "venv"
$python = Join-Path $venv "Scripts\python.exe"

if (-not (Test-Path $python)) {
  Write-Host "Creating the Python environment in .tts\venv ..."
  python -m venv $venv
}
& $python -m pip install --quiet --upgrade pip
& $python -m pip install --quiet -r (Join-Path $PSScriptRoot "local-tts-requirements.txt")

function Get-File($url, $target) {
  if (Test-Path $target) { return }
  Write-Host "Downloading $(Split-Path -Leaf $target) ..."
  New-Item -ItemType Directory -Force (Split-Path -Parent $target) | Out-Null
  Invoke-WebRequest -Uri $url -OutFile "$target.part"
  Move-Item "$target.part" $target
}

# Piper voices (https://huggingface.co/rhasspy/piper-voices, MIT; data licenses on each MODEL_CARD).
$piper = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
$piperVoices = @(
  "nl/nl_BE/rdh/medium/nl_BE-rdh-medium",           # Flemish man
  "nl/nl_BE/nathalie/medium/nl_BE-nathalie-medium", # Flemish woman
  "nl/nl_NL/pim/medium/nl_NL-pim-medium",           # Dutch man
  # The audio guide's other languages (de: CC0, ru: CC0, uk: Apache-2.0 data)
  "de/de_DE/thorsten/high/de_DE-thorsten-high",
  "ru/ru_RU/denis/medium/ru_RU-denis-medium",
  "uk/uk_UA/oleksa/high/uk_UA-oleksa-high"
)
foreach ($voice in $piperVoices) {
  $name = $voice.Split("/")[-1]
  $folder = $voice.Substring(0, $voice.LastIndexOf("/"))
  Get-File "$piper/$voice.onnx" (Join-Path $tts "piper\$name.onnx")
  Get-File "$piper/$voice.onnx.json" (Join-Path $tts "piper\$name.onnx.json")
  Get-File "$piper/$folder/MODEL_CARD" (Join-Path $tts "piper\$name.MODEL_CARD")
}

# Kokoro-82M (Apache-2.0), the ONNX version used by kokoro-onnx.
$kokoro = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"
Get-File "$kokoro/kokoro-v1.0.onnx" (Join-Path $tts "kokoro\kokoro-v1.0.onnx")
Get-File "$kokoro/voices-v1.0.bin" (Join-Path $tts "kokoro\voices-v1.0.bin")

Write-Host "Done. Restart npm run dev and open http://localhost:3000/admin/audio-test"
