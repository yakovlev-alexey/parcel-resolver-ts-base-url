#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

tests=("base-url" "paths" "base-url-paths" "base-url-resource" "paths-resource" "base-url-paths-resource" "paths-invalid-match" "no-tsconfig" "invalid-tsconfig" "js-import")
negative_tests=("paths-invalid-match" "invalid-tsconfig")

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

cleanup(){
    rm -rf .parcel-cache index*

    printf "${RED}TEST \"$1\" FAILED!!!${NC}\n"

    exit 1
}

run_test() {
    printf "\n======================\n"
    printf "Running test \"$1\"...\n"
    if is_negative_test $1;
    then
        yarn parcel build $1/src/main.ts &> /dev/null && cleanup $1
    else
        yarn parcel build $1/src/main.ts &> /dev/null || cleanup $1
    fi
    rm -rf .parcel-cache index*
    printf "${GREEN}TEST \"$1\" SUCCESSFUL${NC}\n"
}

cd tests

printf "Installing deps...\n"
yarn install &> /dev/null || (printf "${RED}FAILED TO INSTALL DEPS${NC}\n" && exit 1)
cp ../index.js node_modules/parcel-resolver-ts-base-url/index.js
printf "Deps installed\n"

run_test ${tests[0]}

for index in "${!tests[@]}";
do
    if [ $index -eq 0 ];
    then
        continue
    fi

    run_test ${tests[$index]}
done


