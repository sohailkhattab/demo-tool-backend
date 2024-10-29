param (
    [string]$type,
    [string]$name,
    [string]$token
)

# Print parameters for debugging
Write-Host "Parameters received: type=$type, name=$name"

# Variables
$testt = "hih"
$apiUrl = "http://localhost:3000/api/export/" + $name   # API to fetch data
$commitMessage = "Auto-generated config JSON for release"
$branchName = $name  # Specify your desired branch name
$projectId = "WEB/vf-consumer-portals"  # Update to your project ID
$releaseBranch = "release/v1"  # Set the release branch name here

# Step 1: Fetch data from the API
Write-Host "Fetching data from the API..."
#$response = Invoke-RestMethod -Uri $apiUrl -Method Get

$response = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers @{"Accept"="application/json; charset=utf-8-bom"}
$response = $response | ConvertTo-Json -Depth 10 | Out-String
$response = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::UTF8.GetBytes($response)) | ConvertFrom-Json

# Check if the response is null or empty
if (-not $response) {
    Write-Host "Failed to fetch data. Exiting..."
    exit 1
}

# Prepare JSON data for the new files
$configEnResponse = @{
    _id = $response._id
    name = $response.name
    components = @{}
    background = $response.background
    createdAt = $response.createdAt
    __v = $response.__v
}

$configArResponse = @{
    _id = $response._id
    name = $response.name
    components = @{}
    background = $response.background
    createdAt = $response.createdAt
    __v = $response.__v
}

# Step 2: Iterate through each component dynamically
foreach ($componentName in $response.components.PSObject.Properties.Name) {
    $component = $response.components.$componentName

    # Check if config_en and config_ar exist for the component
    if ($component.config_en) {
        $configEnResponse.components[$componentName] = @{
            config_en = $component.config_en
        }
    }

    if ($component.config_ar) {
        $configArResponse.components[$componentName] = @{
            config_ar = $component.config_ar
        }
    }
}

# Convert each response object to JSON for writing to files
$jsonDataEn = $configEnResponse | ConvertTo-Json -Depth 10
$jsonDataAr = $configArResponse | ConvertTo-Json -Depth 10

# File paths
$targetFilePathEn = "src/app/feature-modules/demo-tool/config/" + $branchName + "_en.json"
$targetFilePathAr = "src/app/feature-modules/demo-tool/config/" + $branchName + "_ar.json"

# Step 3: Check if the branch exists
$gitLabApiUrl = "https://git.vf-eg.internal.vodafone.com/api/v4/projects/$([System.Web.HttpUtility]::UrlEncode($projectId))/repository/branches/$([System.Web.HttpUtility]::UrlEncode($branchName))"

$branchExists = $false
try {
    $branchResponse = Invoke-RestMethod -Uri $gitLabApiUrl -Method Get -Headers @{
        "PRIVATE-TOKEN" = $token
    }
    Write-Host "Branch '$branchName' already exists."
    $branchExists = $true
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "Branch '$branchName' does not exist. Creating it..."

        # Create the new branch from the default branch (e.g., demo-tool or main)
        $createBranchUrl = "https://git.vf-eg.internal.vodafone.com/api/v4/projects/$([System.Web.HttpUtility]::UrlEncode($projectId))/repository/branches"
        $createBranchBody = @{
            branch = $branchName
            ref = "demo-tool"  # Change this to your default branch if necessary
        } | ConvertTo-Json -Depth 10

        Invoke-RestMethod -Uri $createBranchUrl -Method Post -Body $createBranchBody -Headers @{
            "PRIVATE-TOKEN" = $token
            "Content-Type" = "application/json"
        }
        Write-Host "Branch '$branchName' created successfully."
    } else {
        Write-Host "An error occurred while checking branch: $_"
        exit 1
    }
}

# Step 4: Set action to "update" if branch exists, otherwise "create"
$actionType = if ($branchExists) { "update" } else { "create" }

# Step 5: Push the changes to the branch for both files
$commitData = @{
    branch = $branchName
    commit_message = $commitMessage
    actions = @(
        @{
            action = $actionType
            file_path = $targetFilePathEn
            content = $jsonDataEn
        },
        @{
            action = $actionType
            file_path = $targetFilePathAr
            content = $jsonDataAr
        }
    )
}

# Convert commit data to JSON
$commitJson = $commitData | ConvertTo-Json -Depth 10

# Step 6: Push the changes to the GitLab repository
Write-Host "Pushing the changes to GitLab..."
$pushApiUrl = "https://git.vf-eg.internal.vodafone.com/api/v4/projects/$([System.Web.HttpUtility]::UrlEncode($projectId))/repository/commits"

try {
    $response = Invoke-RestMethod -Uri $pushApiUrl -Method Post -Body $commitJson -Headers @{
        "PRIVATE-TOKEN" = $token
        "Content-Type" = "application/json"
    }
    Write-Host "Script completed successfully! Changes pushed to $branchName."
} catch {
    Write-Host "An error occurred while pushing changes: $_"
}

# Step 7: Checkout on the release branch and cherry-pick the changes from the new branch
Write-Host "Checking out to the release branch '$releaseBranch' and cherry-picking the changes from '$branchName'..."

# Get the commit SHA from the new branch
$commitUrl = "https://git.vf-eg.internal.vodafone.com/api/v4/projects/$([System.Web.HttpUtility]::UrlEncode($projectId))/repository/branches/$([System.Web.HttpUtility]::UrlEncode($branchName))"
$commitSha = ""

try {
    $branchDetails = Invoke-RestMethod -Uri $commitUrl -Method Get -Headers @{
        "PRIVATE-TOKEN" = $token
    }

    # Fetch the latest commit SHA from the new branch
    $commitSha = $branchDetails.commit.id
    Write-Host "Commit SHA for branch '$branchName': $commitSha"
} catch {
    Write-Host "Failed to retrieve commit SHA for '$branchName': $_"
    exit 1
}

# Use the Cherry-pick API to apply the changes to the release branch
$cherryPickUrl = "https://git.vf-eg.internal.vodafone.com/api/v4/projects/$([System.Web.HttpUtility]::UrlEncode($projectId))/repository/commits/$commitSha/cherry_pick"
$cherryPickBody = @{
    branch = $releaseBranch
} | ConvertTo-Json -Depth 10

try {
    $cherryPickResponse = Invoke-RestMethod -Uri $cherryPickUrl -Method Post -Body $cherryPickBody -Headers @{
        "PRIVATE-TOKEN" = $token
        "Content-Type" = "application/json"
    }

    Write-Host "Successfully cherry-picked commit '$commitSha' from '$branchName' into '$releaseBranch'."
} catch {
    Write-Host "An error occurred while cherry-picking the commit: $_"
}
