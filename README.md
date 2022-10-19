# parcel-resolver-ts-base-url

At the moment Parcel does not support resolving imports using `paths` and `baseUrl` properties from `tsconfig.json`. This is a big issue both when migrating existing projects leveraging these properties and for developers having preference for TypeScript path aliases. This resolver allows you to use the same imports with `parcel@^2` as when using `tsc`.

![](https://img.shields.io/bundlephobia/minzip/parcel-resolver-ts-base-url?style=social)

## Table of Contents

- [parcel-resolver-ts-base-url](#parcel-resolver-ts-base-url)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install `parcel-resolver-ts-base-url` using npm or yarn:

```bash
npm i --save-dev parcel-resolver-ts-base-url
# or
yarn add -D parcel-resolver-ts-base-url
```

## Usage

Simply add `parcel-resolver-ts-base-url` to your `.parcelrc`:

```json
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-ts-base-url", "..."]
}
```

> At the moment `parcel` doesn't provide a way to specify `tsconfig.json` location I know of. `parcel-resolver-ts-base-url` will look for `tsconfig.json` recursively from the import location to the project root (`.parcelrc` location) like Parcel itself does.

Read more about `parcel` configuration in [official docs](https://parceljs.org/features/plugins/).

### Known Issues

- ~~HMR support is unknown.~~ Manually tested and seems to be working. Make sure to submit a [GitHub issue](https://github.com/yakovlev-alexey/parcel-resolver-ts-base-url/issues) if it does not work for you.
- ~~Resources imports using `baseUrl` or `paths` is unsupported in this resolver. Feel free to submit a PR.~~ Has been implemented with tests in place.

## Contributing

Feel free to send any suggestions in [GitHub issues](https://github.com/yakovlev-alexey/parcel-resolver-ts-base-url/issues): comment or vote on an existing issue, open a new one or create a Pull Request with your feature. Please make sure to add relevant test cases.

## License

[MIT](/LICENSE)
