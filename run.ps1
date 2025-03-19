# Creer un repertoire logs s'il n'existe pas
$logsDir = ".\logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
    Write-Host "Repertoire de logs cree: $logsDir" -ForegroundColor Green
}

# Definir les chemins des fichiers de log avec horodatage
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$serverLogPath = "$logsDir\server_$timestamp.log"
$clientLogPath = "$logsDir\client_$timestamp.log"

# Creer les fichiers de log vides avec l'encodage UTF-8
"" | Out-File -FilePath $serverLogPath -Encoding utf8
"" | Out-File -FilePath $clientLogPath -Encoding utf8

# Creer un bloc de commandes pour le serveur Flask
$serverScript = {
    param($serverLogPath, $timestamp)
    
    # Rediriger vers le fichier de log
    Start-Transcript -Path $serverLogPath -Append -Force
    
    Set-Location server
    
    # Logger le demarrage
    Write-Output "$timestamp - Demarrage du serveur Flask..."
    
    if (Test-Path .venv\Scripts\activate.ps1) {
        try {
            # Activer l'environnement virtuel
            . .\.venv\Scripts\activate.ps1
            
            # Executer Flask
            Write-Output "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Lancement du serveur Flask sur http://localhost:5000"
            flask run --debug
        }
        catch {
            Write-Output "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Erreur Flask: $($_.Exception.Message)"
        }
    }
    else {
        Write-Output "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Erreur: Environnement virtuel non trouve"
    }
    
    Stop-Transcript
}

# Creer un bloc de commandes pour le client React
$clientScript = {
    param($clientLogPath, $timestamp)
    
    # Rediriger vers le fichier de log
    Start-Transcript -Path $clientLogPath -Append -Force
    
    Set-Location client
    
    # Logger le demarrage
    Write-Output "$timestamp - Demarrage du client React..."
    
    try {
        # Configurer l'encodage UTF-8
        [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
        
        # Executer Vite/React (supposant que c'est un projet Vite)
        Write-Output "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Lancement du client React"
        npm run dev
    }
    catch {
        Write-Output "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Erreur React: $($_.Exception.Message)"
    }
    
    Stop-Transcript
}

# Demarrer les processus dans de nouvelles fenetres PowerShell (meilleure visibilite qu'avec des jobs)
$serverWindowTitle = "Serveur Flask - $timestamp"
$clientWindowTitle = "Client React - $timestamp"

# Demarrer le serveur Flask dans une nouvelle fenetre
Start-Process powershell -ArgumentList "-NoExit -Command & {
    `$Host.UI.RawUI.WindowTitle = '$serverWindowTitle'
    `$scriptBlock = { $($serverScript.ToString()) }
    & `$scriptBlock '$serverLogPath' '$timestamp'
}" -WindowStyle Normal

# Demarrer le client React dans une nouvelle fenetre
Start-Process powershell -ArgumentList "-NoExit -Command & {
    `$Host.UI.RawUI.WindowTitle = '$clientWindowTitle'
    `$scriptBlock = { $($clientScript.ToString()) }
    & `$scriptBlock '$clientLogPath' '$timestamp'
}" -WindowStyle Normal

Write-Host "Serveurs demarres dans de nouvelles fenetres." -ForegroundColor Green
Write-Host "Les logs du serveur sont enregistres dans: $serverLogPath" -ForegroundColor Yellow
Write-Host "Les logs du client sont enregistres dans: $clientLogPath" -ForegroundColor Yellow

# Fonction pour suivre les logs en temps reel
function Watch-Logs {
    param (
        [Parameter(Mandatory=$true)]
        [string]$logFile
    )
    
    if (Test-Path $logFile) {
        Write-Host "Affichage des logs en temps reel de $logFile. Appuyez sur Ctrl+C pour quitter." -ForegroundColor Cyan
        Get-Content -Path $logFile -Wait -Encoding utf8
    } else {
        Write-Host "Fichier de log non trouve: $logFile" -ForegroundColor Red
    }
}

# Fonction pour arreter tous les processus et fermer les fenetres
function Stop-AllServers {
    param (
        [Parameter(Mandatory=$false)]
        [string]$processInfoFile = $null
    )
    
    if ($null -eq $processInfoFile) {
        # Trouver le fichier process_info le plus recent
        $processInfoFile = Get-ChildItem -Path $logsDir -Filter "process_info_*.txt" | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName
    }
    
    if (-not (Test-Path $processInfoFile)) {
        Write-Host "Aucun fichier d'information de processus trouve. Impossible d'arreter les serveurs." -ForegroundColor Red
        return
    }
    
    Write-Host "Arret des serveurs en cours..." -ForegroundColor Yellow
    
    # Lire les informations de processus
    $processInfo = Get-Content -Path $processInfoFile -Encoding utf8
    
    # Extraire les PIDs et les titres des fenetres
    $serverPID = ($processInfo | Where-Object { $_ -match "SERVER_PID=(\d+)" } | ForEach-Object { $matches[1] })
    $clientPID = ($processInfo | Where-Object { $_ -match "CLIENT_PID=(\d+)" } | ForEach-Object { $matches[1] })
    $serverWindow = ($processInfo | Where-Object { $_ -match "SERVER_WINDOW=(.*)" } | ForEach-Object { $matches[1] })
    $clientWindow = ($processInfo | Where-Object { $_ -match "CLIENT_WINDOW=(.*)" } | ForEach-Object { $matches[1] })
    
    # Arreter les processus par PID
    if ($serverPID) {
        try {
            $process = Get-Process -Id $serverPID -ErrorAction SilentlyContinue
            if ($process) {
                $process | Stop-Process -Force
                Write-Host "Serveur Flask (PID: $serverPID) arrete." -ForegroundColor Green
            }
        } catch {
            Write-Host "Impossible d'arreter le processus serveur (PID: $serverPID): $_" -ForegroundColor Red
        }
    }
    
    if ($clientPID) {
        try {
            $process = Get-Process -Id $clientPID -ErrorAction SilentlyContinue
            if ($process) {
                $process | Stop-Process -Force
                Write-Host "Client React (PID: $clientPID) arrete." -ForegroundColor Green
            }
        } catch {
            Write-Host "Impossible d'arreter le processus client (PID: $clientPID): $_" -ForegroundColor Red
        }
    }
    
    # Fermer les fenetres par titre
    if ($serverWindow) {
        try {
            Get-Process | Where-Object { $_.MainWindowTitle -eq $serverWindow } | Stop-Process -Force
            Write-Host "Fenetre '$serverWindow' fermee." -ForegroundColor Green
        } catch {
            Write-Host "Impossible de fermer la fenetre '$serverWindow': $_" -ForegroundColor Red
        }
    }
    
    if ($clientWindow) {
        try {
            Get-Process | Where-Object { $_.MainWindowTitle -eq $clientWindow } | Stop-Process -Force
            Write-Host "Fenetre '$clientWindow' fermee." -ForegroundColor Green
        } catch {
            Write-Host "Impossible de fermer la fenetre '$clientWindow': $_" -ForegroundColor Red
        }
    }
    
    # Arreter les processus node.js associes au client React
    try {
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        foreach ($nodeProcess in $nodeProcesses) {
            $commandLine = (Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($nodeProcess.Id)").CommandLine
            if ($commandLine -and $commandLine -match "vite|dev-server") {
                $nodeProcess | Stop-Process -Force
                Write-Host "Processus Node.js associe au client React arrete (PID: $($nodeProcess.Id))." -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "Impossible d'arreter certains processus Node.js: $_" -ForegroundColor Red
    }
    
    Write-Host "Tous les serveurs ont ete arretes." -ForegroundColor Green
}

# Fonction pour nettoyer les logs
function Clear-Logs {
    param (
        [Parameter(Mandatory=$false)]
        [switch]$KeepLatest,
        
        [Parameter(Mandatory=$false)]
        [int]$DaysToKeep = 7
    )
    
    if (-not (Test-Path $logsDir)) {
        Write-Host "Repertoire de logs non trouve: $logsDir" -ForegroundColor Red
        return
    }
    
    if ($KeepLatest) {
        # Garder uniquement les logs des derniers jours specifies
        $cutoffDate = (Get-Date).AddDays(-$DaysToKeep)
        $oldLogs = Get-ChildItem -Path $logsDir -File | Where-Object { $_.LastWriteTime -lt $cutoffDate }
        
        if ($oldLogs.Count -gt 0) {
            $oldLogs | Remove-Item -Force
            Write-Host "Nettoyage termine. $($oldLogs.Count) fichiers logs anterieurs a $($cutoffDate.ToString('yyyy-MM-dd')) ont ete supprimes." -ForegroundColor Green
        } else {
            Write-Host "Aucun fichier log anterieur a $($cutoffDate.ToString('yyyy-MM-dd')) trouve." -ForegroundColor Yellow
        }
    } else {
        # Supprimer tous les logs
        $logFiles = Get-ChildItem -Path $logsDir -File
        $logCount = $logFiles.Count
        
        if ($logCount -gt 0) {
            $confirmation = Read-Host "Etes-vous sur de vouloir supprimer tous les $logCount fichiers logs ? (O/N)"
            if ($confirmation -eq "O" -or $confirmation -eq "o") {
                $logFiles | Remove-Item -Force
                Write-Host "Nettoyage termine. $logCount fichiers logs ont ete supprimes." -ForegroundColor Green
            } else {
                Write-Host "Operation annulee." -ForegroundColor Yellow
            }
        } else {
            Write-Host "Aucun fichier log trouve." -ForegroundColor Yellow
        }
    }
}

Write-Host "`nCommandes disponibles:" -ForegroundColor Cyan
Write-Host "- Pour suivre les logs du serveur: " -NoNewline -ForegroundColor Cyan
Write-Host "Watch-Logs -logFile '$serverLogPath'" -ForegroundColor White
Write-Host "- Pour suivre les logs du client: " -NoNewline -ForegroundColor Cyan
Write-Host "Watch-Logs -logFile '$clientLogPath'" -ForegroundColor White
Write-Host "- Pour arreter tous les serveurs: " -NoNewline -ForegroundColor Cyan
Write-Host "Stop-AllServers" -ForegroundColor White
Write-Host "- Pour nettoyer tous les logs: " -NoNewline -ForegroundColor Cyan
Write-Host "Clear-Logs" -ForegroundColor White
Write-Host "- Pour nettoyer les logs plus vieux que 7 jours: " -NoNewline -ForegroundColor Cyan
Write-Host "Clear-Logs -KeepLatest" -ForegroundColor White
Write-Host "- Pour nettoyer les logs plus vieux qu'un nombre specifique de jours: " -NoNewline -ForegroundColor Cyan
Write-Host "Clear-Logs -KeepLatest -DaysToKeep 30" -ForegroundColor White