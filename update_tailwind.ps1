$path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = $path

cd "d:\Hackathon work\rapidresq_frontend"
npm install -D @tailwindcss/postcss
