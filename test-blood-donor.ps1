# Test Blood Donor Endpoints

param(
    [string]$BaseUrl = "http://localhost:4000"
)

# Test credentials
$email = "teacher1@test.com"
$password = "password123"

Write-Host "Starting Blood Donor Endpoint Tests..." -ForegroundColor Yellow
Write-Host "Base URL: $BaseUrl`n" -ForegroundColor Gray

# 1. Login
Write-Host "1. Logging in with $email..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body (@{email = $email; password = $password} | ConvertTo-Json) `
        -SkipHttpErrorCheck

    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        $token = $data.data.accessToken
        $userId = $data.data.user.id
        Write-Host "✓ Login successful" -ForegroundColor Green
        Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "  User ID: $userId`n" -ForegroundColor Gray
    }
    else {
        Write-Host "✗ Login failed with status $($response.StatusCode)" -ForegroundColor Red
        Write-Host $response.Content -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "✗ Login error: $_" -ForegroundColor Red
    exit 1
}

# Helper function for API calls
function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [string]$Description
    )
    
    Write-Host $Description -ForegroundColor Cyan
    
    try {
        $headers = @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"}
        $params = @{
            Uri = "$BaseUrl/api/blood-donor$Endpoint"
            Method = $Method
            Headers = $headers
            SkipHttpErrorCheck = $true
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json -Depth 10
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -in @(200, 201)) {
            $data = $response.Content | ConvertFrom-Json
            Write-Host "✓ Success" -ForegroundColor Green
            return $data
        }
        else {
            Write-Host "✗ Failed with status $($response.StatusCode)" -ForegroundColor Red
            if ($response.Content) {
                Write-Host "  Error: $($response.Content)" -ForegroundColor Red
            }
            return $null
        }
    }
    catch {
        Write-Host "✗ Error: $_" -ForegroundColor Red
        return $null
    }
}

# 2. Test GET /donors
$result = Invoke-ApiCall "GET" "/donors" $null "2. Testing GET /donors..."
if ($result) {
    Write-Host "  Found $($result.data.Count) donors`n" -ForegroundColor Gray
}

# 3. Test POST /register
$registerData = @{
    bloodType = "O+"
    availableForDonation = $true
    willingToDonate = $true
    lastDonated = [DateTime]::Now.AddMonths(-3)
    donationHistory = @()
}

$result = Invoke-ApiCall "POST" "/register" $registerData "3. Testing POST /register..."
if ($result) {
    Write-Host "  Blood type: $($result.data.bloodType)`n" -ForegroundColor Gray
}

# 4. Test GET /my-profile
Invoke-ApiCall "GET" "/my-profile" $null "4. Testing GET /my-profile..." | Out-Null
Write-Host ""

# 5. Test POST /record-donation
$donationData = @{
    date = [DateTime]::Now.ToString("o")
    location = "Red Crescent Blood Bank"
    recipient = "Type O Positive Patient"
    notes = "Successful donation"
}

Invoke-ApiCall "POST" "/record-donation" $donationData "5. Testing POST /record-donation..." | Out-Null

Write-Host "✓ All tests completed!`n" -ForegroundColor Green

