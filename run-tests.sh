#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

files_to_move=("node_modules" ".parcelrc" "package.json" "yarn.lock")
tests=("base-url" "paths" "base-url-paths")

move_files() {
    for file in "${files_to_move[@]}";
    do
        mv "$1$file" "$2$file"
    done
}

cleanup(){
    move_files "" "../"

    rm -rf .parcel-cache index*

    printf "${RED}TEST \"$1\" FAILED!!!${NC}\n"

    cd ..
    exit 1
}

run_test() {
    cd $1
    printf "\n======================\n"
    printf "Running test \"$1\"...\n"
    yarn parcel build src/main.ts &> /dev/null || cleanup $1
    rm -rf .parcel-cache index*
    printf "${GREEN}TEST \"$1\" SUCCESSFUL${NC}\n"
    cd ..
}

cd tests

printf "Installing deps...\n"
yarn install &> /dev/null || (printf "${RED}FAILED TO INSTALL DEPS${NC}\n" && exit 1)
cp ../index.js node_modules/parcel-resolver-ts-base-url/index.js
printf "Deps installed\n"

move_files "" "${tests[0]}/"
run_test ${tests[0]}

for index in "${!tests[@]}";
do
    if [ $index -eq 0 ];
    then
        continue
    fi

    move_files "${tests[$index-1]}/" "${tests[$index]}/"
    run_test ${tests[$index]}
done

move_files "${tests[${#tests[@]} - 1]}/" ""

