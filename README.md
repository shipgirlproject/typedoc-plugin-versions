# @shipgirl/typedoc-plugin-versions

Fork of [citkane's typedoc-plugin-versions](https://github.com/citkane/typedoc-plugin-versions)


## Usage

```jsonc
"plugin": ["@shipgirl/typedoc-plugin-versions"],
"versions": { /*...options */ }
```


## Options

| Key                   | Value Information                                                                                                         | Type      | Required | Default                                                                                                                                                                              |
| :-------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------- | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **_stable_**          | The version that you would like to be marked as `stable`                                                                  | `string`  |  **no**  | [Automatically inferred](https://github.com/citkane/typedoc-plugin-versions/wiki/%22stable%22-and-%22dev%22-version-automatic-inference) based on current version and build history. |
| **_dev_**             | The version that you would like to be marked as `dev`                                                                     | `string`  |  **no**  | [Automatically inferred](https://github.com/citkane/typedoc-plugin-versions/wiki/%22stable%22-and-%22dev%22-version-automatic-inference) based on current version and build history. |
| **_domLocation_**     | A custom DOM location to render the HTML `select` dropdown corresponding to typedoc rendererHooks, eg. "navigation.begin" | `string`  |  **no**  | Injects to left of header using vanilla js - not a typedoc render hook.                                                                                                              |
| **packageFile**       | Pass in an alternative name convention for "package.json"                                                                 | `string`  |  **no**  | package.json                                                                                                                                                                         |
| **makeRelativeLinks** | Create relative instead of absolute symlinks in the document out directory                                                | `boolean` |  **no**  | `false`                                                                                                                                                                              |

## "What sorcery is this?", you may ask...

Typedoc-plugin-versions takes the architectural approach of [JuliaLang Documenter](https://juliadocs.github.io/Documenter.jl/stable/).

Documents are built into subdirectories corresponding to the package.json version.  
Symlinks are created to minor versions, which are given as options in a `select` menu.

As long as you do not delete your historic document build folders, the document history remains intact.

If you want to remove a historic version, delete the old folder and rebuild your documentation.

## CID

Below is an opinionated Github CI setup. You can hack and change it to suite your needs.

**How to for Github Actions**:

-   In your project's `package.json`, set up scripts for:
    -   **build** - to build your project, eg. "tsc --outDir ./dist"
    -   **docs** - to build your documents, eg "typedoc --out ./docs"
-   Ensure that your documents are being built into a folder named `./docs` (or change your workflow file appropriately)
-   Create an empty branch called gh-pages
-   Under your repository's 'Pages' settings, set:
    -   **Source**: Deploy from a branch
    -   **Branch**: gh-pages/docs (symlinks won't work in the gh-pages/root folder)
-   Create a [custom workflow](https://docs.github.com/en/actions/quickstart) as per [this template](https://github.com/citkane/typedoc-plugin-versions/blob/main/.github/workflows/docs.yml) for PUBLISH DOCS.

The "PUBLISH DOCS" action will create a rolling update to your document set.
