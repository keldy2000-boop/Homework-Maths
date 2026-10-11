# Puts the latest homework online (GitHub Pages). Usage:  powershell -File tools\publish.ps1 "Add Year 4 homework 2026-10-12"
param([string]$Message = "Update homework")
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
git add -A
if (-not (git status --porcelain)) { Write-Output "Nothing new to publish."; exit 0 }
git commit -m $Message
git push
Write-Output "Published. The site updates within a couple of minutes."
