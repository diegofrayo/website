# copy only required files to "diegofrayo-backend" repo
backend_repo_dir=../diegofrayo-backend/src/@diegofrayo

rm -r "$backend_repo_dir"
mkdir -p "$backend_repo_dir"
cp -r ./src/lib/@diegofrayo/types "$backend_repo_dir"
cp ./src/lib/@diegofrayo/v.ts "$backend_repo_dir"

mkdir -p "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/arrays-and-objects.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/files.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/misc.ts "$backend_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/strings.ts "$backend_repo_dir/utils"

# ---- ---- ----

# copy only required files to "scripts" repo
scripts_repo_dir=../../scripts/src/@diegofrayo

rm -r "$scripts_repo_dir"
mkdir -p "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/arrays-and-objects.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/files.ts "$scripts_repo_dir/utils"
cp ./src/lib/@diegofrayo/utils/strings.ts "$scripts_repo_dir/utils"