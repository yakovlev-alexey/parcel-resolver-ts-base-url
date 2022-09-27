#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# parcel would not allow to use multiple .tsconfig.json files in the same npm project
# to combat this we move npm and parcel files around test directories
# so that we do not have to duplicate files and install deps multiple times
files_to_move=("node_modules" ".parcelrc" "package.json" "yarn.lock")
tests=("base-url" "paths" "base-url-paths" "base-url-resource" "paths-resource" "base-url-paths-resource" "paths-invalid-match")
negative_tests=("paths-invalid-match")

contains_element() {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 1; done
  return 0
}

is_negative_test(){
    if contains_element $1 "${negative_tests[@]}"
    then
        return 1
    else
        return 0
    fi
}

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
    if is_negative_test $1;
    then
        yarn parcel build src/main.ts &> /dev/null && cleanup $1
    else
        yarn parcel build src/main.ts &> /dev/null || cleanup $1
    fi
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

