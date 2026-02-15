param([string]$BaseUrl = "http://localhost:4000")

$teacherUser = "T-2024-001"
$teacherPass = "teacher123"
$studentUser = "S-2024-A-001"
$studentPass = "student123"

Add-Type -AssemblyName System.Net.Http

function Login-User {
    param([string]$Username, [string]$Password)
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body (@{username = $Username; password = $Password} | ConvertTo-Json) `
            -UseBasicParsing `
            -ErrorAction Stop

        $data = $response.Content | ConvertFrom-Json
        if (-not $data.accessToken) {
            throw "Access token missing from login response"
        }
        return $data.accessToken
    }
    catch {
        throw "Login failed for ${Username}: $($_.Exception.Message)"
    }
}

function Invoke-Json {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Token,
        [object]$Body = $null
    )

    $headers = @{ Authorization = "Bearer $Token" }
    $params = @{
        Uri = $Url
        Method = $Method
        Headers = $headers
        UseBasicParsing = $true
        ErrorAction = 'Stop'
    }

    if ($Body) {
        $params.ContentType = 'application/json'
        $params.Body = ($Body | ConvertTo-Json -Depth 10)
    }

    try {
        $response = Invoke-WebRequest @params
        return $response.Content | ConvertFrom-Json
    }
    catch {
        $message = $_.Exception.Message
        if ($_.Exception.Response -and $_.Exception.Response.GetResponseStream()) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $bodyText = $reader.ReadToEnd()
            if ($bodyText) {
                $message = "$message | $bodyText"
            }
        }
        throw "Request failed ($Method $Url): $message"
    }
}

function Upload-Photo {
    param(
        [string]$Url,
        [string]$Token,
        [string]$FilePath
    )

    $handler = New-Object System.Net.Http.HttpClientHandler
    $client = New-Object System.Net.Http.HttpClient($handler)
    $client.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $Token)

    $content = New-Object System.Net.Http.MultipartFormDataContent
    $fileBytes = [System.IO.File]::ReadAllBytes($FilePath)
    $fileContent = [System.Net.Http.ByteArrayContent]::new($fileBytes)
    $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('image/png')
    $content.Add($fileContent, 'photo', [System.IO.Path]::GetFileName($FilePath))

    $response = $client.PostAsync($Url, $content).Result
    $body = $response.Content.ReadAsStringAsync().Result
    $client.Dispose()

    if (-not $response.IsSuccessStatusCode) {
        throw "Upload failed: $($response.StatusCode) $body"
    }

    return $body | ConvertFrom-Json
}

function Write-Section {
    param([string]$Title)
    Write-Host ""; Write-Host $Title -ForegroundColor Cyan
}

Write-Host "Starting profile endpoint tests..." -ForegroundColor Yellow
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray

# Prepare a tiny PNG for upload
$pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
$photoPath = "d:\edVerse\temp-profile.png"
[System.IO.File]::WriteAllBytes($photoPath, [Convert]::FromBase64String($pngBase64))

# Teacher tests
Write-Section "Teacher profile endpoints"
$teacherToken = Login-User -Username $teacherUser -Password $teacherPass
Write-Host "Logged in as teacher" -ForegroundColor Green

$teacherProfile = Invoke-Json -Method GET -Url "$BaseUrl/api/teacher/profile" -Token $teacherToken
Write-Host "GET /teacher/profile: OK" -ForegroundColor Green

$updatedPhone = "+1234567890"
Invoke-Json -Method PUT -Url "$BaseUrl/api/teacher/profile" -Token $teacherToken -Body @{ phone = $updatedPhone } | Out-Null
Write-Host "PUT /teacher/profile: OK" -ForegroundColor Green

Invoke-Json -Method POST -Url "$BaseUrl/api/teacher/change-password" -Token $teacherToken -Body @{ oldPassword = $teacherPass; newPassword = "teacher123-temp" } | Out-Null
Write-Host "POST /teacher/change-password: OK" -ForegroundColor Green
$teacherToken = Login-User -Username $teacherUser -Password "teacher123-temp"
Invoke-Json -Method POST -Url "$BaseUrl/api/teacher/change-password" -Token $teacherToken -Body @{ oldPassword = "teacher123-temp"; newPassword = $teacherPass } | Out-Null
Write-Host "Password reset to original" -ForegroundColor Green

Upload-Photo -Url "$BaseUrl/api/teacher/upload-photo" -Token $teacherToken -FilePath $photoPath | Out-Null
Write-Host "POST /teacher/upload-photo: OK" -ForegroundColor Green

# Student tests
Write-Section "Student profile endpoints"
$studentToken = Login-User -Username $studentUser -Password $studentPass
Write-Host "Logged in as student" -ForegroundColor Green

Invoke-Json -Method GET -Url "$BaseUrl/api/student/profile" -Token $studentToken | Out-Null
Write-Host "GET /student/profile: OK" -ForegroundColor Green

$studentPhone = "+1234560001"
Invoke-Json -Method PUT -Url "$BaseUrl/api/student/profile" -Token $studentToken -Body @{ phone = $studentPhone } | Out-Null
Write-Host "PUT /student/profile: OK" -ForegroundColor Green

Invoke-Json -Method POST -Url "$BaseUrl/api/student/change-password" -Token $studentToken -Body @{ oldPassword = $studentPass; newPassword = "student123-temp" } | Out-Null
Write-Host "POST /student/change-password: OK" -ForegroundColor Green
$studentToken = Login-User -Username $studentUser -Password "student123-temp"
Invoke-Json -Method POST -Url "$BaseUrl/api/student/change-password" -Token $studentToken -Body @{ oldPassword = "student123-temp"; newPassword = $studentPass } | Out-Null
Write-Host "Password reset to original" -ForegroundColor Green

Upload-Photo -Url "$BaseUrl/api/student/upload-photo" -Token $studentToken -FilePath $photoPath | Out-Null
Write-Host "POST /student/upload-photo: OK" -ForegroundColor Green

Write-Host ""; Write-Host "Profile endpoint tests completed." -ForegroundColor Green
