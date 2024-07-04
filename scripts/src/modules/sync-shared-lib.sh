# npm run script:sync-shared-lib

# copy only required files to "diegofrayo-backend" repo
backend_repo_dir=../diegofrayo-backend/src/@diegofrayo

rm -r "$backend_repo_dir"
mkdir -p "$backend_repo_dir"
cp -r ./src/lib/@diegofrayo/types "$backend_repo_dir"
cp ./src/lib/@diegofrayo/sort.ts "$backend_repo_dir"
cp ./src/lib/@diegofrayo/v.ts "$backend_repo_dir"

mkdir -p "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/arrays-and-objects.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/database.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/files.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/misc.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/strings.ts "$backend_repo_dir/utils"

# copy only required files to "scripts" repo
scripts_repo_dir=../../scripts/src/@diegofrayo

rm -r "$scripts_repo_dir"
mkdir -p "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/arrays-and-objects.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/dates.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/files.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/misc.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/strings.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/v.ts "$scripts_repo_dir"
cp ./src/lib/@diegofrayo/sort.ts "$scripts_repo_dir"

mkdir -p "$scripts_repo_dir/types"
cp ./src/lib/@diegofrayo/types/index.ts "$scripts_repo_dir/types"

# copy only required files to "bets" repo
bets_repo_dir=../../bets/src/@diegofrayo

rm -r "$bets_repo_dir"
mkdir -p "$bets_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/arrays-and-objects.ts "$bets_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/dates.ts "$bets_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/files.ts "$bets_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/misc.ts "$bets_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/strings.ts "$bets_repo_dir/utils"
cp ./src/lib/@diegofrayo/v.ts "$bets_repo_dir"
cp ./src/lib/@diegofrayo/sort.ts "$bets_repo_dir"

mkdir -p "$bets_repo_dir/types"
cp ./src/lib/@diegofrayo/types/index.ts "$bets_repo_dir/types"

# copy only required files to "rutas" repo
rutas_repo_dir=../../demos/rutas/src/lib/@diegofrayo

rm -r "$rutas_repo_dir"
mkdir -p "$rutas_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/arrays-and-objects.ts "$rutas_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/dates.ts "$rutas_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/files.ts "$rutas_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/misc.ts "$rutas_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/strings.ts "$rutas_repo_dir/utils"
cp ./src/lib/@diegofrayo/v.ts "$rutas_repo_dir"
cp ./src/lib/@diegofrayo/sort.ts "$rutas_repo_dir"

mkdir -p "$rutas_repo_dir/types"
cp ./src/lib/@diegofrayo/types/index.ts "$rutas_repo_dir/types"