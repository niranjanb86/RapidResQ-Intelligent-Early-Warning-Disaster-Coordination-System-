$path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = $path

npx -y create-vite@latest rapidresq_frontend --template react
cd rapidresq_frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom leaflet react-leaflet axios lucide-react
