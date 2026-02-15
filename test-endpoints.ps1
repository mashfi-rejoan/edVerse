#!/usr/bin/env pwsh
param([string]$BaseUrl = "http://localhost:4000")

$email = "admin@edverse.edu"
$password = "admin123"

Write-Host "Starting Blood Donor Endpoint Tests..." -ForegroundColor Yellow
Write-Host "Base URL: $BaseUrl`n" -ForegroundColor Gray

# 1. Login
Write-Host "1. Logging in with $email..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{username = $email; password = $password} | ConvertTo-Json) `
        -UseBasicParsing `
        -ErrorAction Stop

    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        $token = $data.accessToken
        $userId = $data.user.id
        Write-Host "SUCCESS - Login worked" -ForegroundColor Green
        Write-Host "User: $userId" -ForegroundColor Gray
    }
    else {
        Write-Host "FAILED - Login returned $($response.StatusCode)" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "FAILED - Login error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. GET /donors..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/blood-donor/donors" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $token"} `
        -UseBasicParsing `
        -ErrorAction Stop

    Write-Host "SUCCESS" -ForegroundColor Green
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. POST /register..." -ForegroundColor Cyan
$body = @{
    name = "Admin User"
    email = $email
    phone = "01700000000"
    bloodType = "O+"
    userType = "Staff"
    location = "Main Campus"
    emergencyContact = "01700000001"
    availableForDonation = $true
    willingToDonate = $true
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/blood-donor/register" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{"Authorization" = "Bearer $token"} `
        -Body $body `
        -UseBasicParsing `
        -ErrorAction Stop

    Write-Host "SUCCESS" -ForegroundColor Green
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. GET /my-profile..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/blood-donor/my-profile" `
        -Method GET `
        -Headers @{"Authorization" = "Bearer $token"} `
        -UseBasicParsing `
        -ErrorAction Stop

    Write-Host "SUCCESS" -ForegroundColor Green
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. POST /record-donation..." -ForegroundColor Cyan
$body = @{
    date = [DateTime]::Now.ToString("o")
    location = "Blood Bank"
    notes = "Test"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/blood-donor/record-donation" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{"Authorization" = "Bearer $token"} `
        -Body $body `
        -UseBasicParsing `
        -ErrorAction Stop

    Write-Host "SUCCESS" -ForegroundColor Green
}
catch {
    Write-Host "FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Tests completed" -ForegroundColor Green
