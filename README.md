# parcel-resolver-ts-paths

At the moment Parcel does not support resolving imports using `paths` and `baseUrl` properties from `tsconfig.json`. This is a big issue both when migrating existing projects leveraging these properties and for developers having preference for TypeScript path aliases. This resolver allows you to use the same imports with `parcel@^2` as when using `tsc`.

![](https://img.shields.io/bundlephobia/minzip/parcel-resolver-ts-paths?style=social)

## Table of Contents

- [parcel-resolver-ts-paths](#parcel-resolver-ts-paths)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install `parcel-resolver-ts-paths` using npm or yarn:

```bash
npm i --save-dev parcel-resolver-ts-paths
# or
yarn add -D parcel-resolver-ts-paths
```

## Usage

Simply add `parcel-resolver-ts-paths` to your `.parcelrc`:

```json
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-ts-paths", "..."]
}
```

> At the moment `parcel` doesn't provide a way to specify `tsconfig.json` location I know of. `parcel-resolver-ts-paths` will use `tsconfig.json` from the project root.

Read more about `parcel` configuration in [official docs](https://parceljs.org/features/plugins/).

## Contributing

Feel free to send any suggestions in [GitHub issues](https://github.com/yakovlev-alexey/parcel-resolver-ts-paths/issues): comment or vote on an existing issue, open a new one or create a Pull Request with your feature.

## License

[MIT](/LICENSE)
