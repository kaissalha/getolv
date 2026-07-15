# `@getolv/spoonacular`

Vendored Spoonacular API client built from [`ddsky/spoonacular-api-clients`](https://github.com/ddsky/spoonacular-api-clients/tree/master/typescript).

- Upstream repo: `https://github.com/ddsky/spoonacular-api-clients`
- Upstream directory: `typescript`
- Upstream HEAD used for this vendored build: `75ec4fc8037fa47a20ff4dfd7a00fa87e2d08177`
- Local package contents: built `dist/` artifacts only

## Usage

```ts
import { RecipesApi, createConfiguration } from "@getolv/spoonacular";

const configuration = createConfiguration({
	authMethods: {
		apiKeyScheme: process.env.SPOONACULAR_API_KEY ?? "",
	},
});

const recipesApi = new RecipesApi(configuration);
```

This package intentionally does not keep the upstream generator source in the monorepo. To refresh it, rebuild from the upstream `typescript` client and replace the vendored `dist/` output.
