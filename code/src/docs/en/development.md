Welcome to the Security Headers app. This repo contains source code and build scripts to build and deploy a package to be run in Enonic XP.

# Repositories
This project has 1 repository:

| Repository       | Description          | Type      | Path           |
| ---------------- | -------------------- | --------- | -------------- |
| security-headers | application          | Main      | /              |


# Local project setup
## Tools
[Git](https://git-scm.com/): Version control FTW.

[nvm](https://github.com/nvm-sh/nvm): Node and npm version manager. Node and npm are used for managing dependencies.

A modern IDE such as [IntelliJ IDEA](https://www.jetbrains.com/idea/), [WebStorm](https://www.jetbrains.com/webstorm/), [Visual Studio Code](https://code.visualstudio.com/), or any other that you prefer.

[sdkman](https://sdkman.io/): Version manager for a plethora of tools, most notably Java and Gradle.

## Development environment
Make sure to use Java version 11. Check by running `java -version`. Use `sdkman` to adjust if necessary.

Enonic CLI (Command Line Interface) needs to be installed. See
[documentation for Enonic CLI](https://developer.enonic.com/docs/enonic-cli/master/install) for details.
Check your version by executing `enonic latest`. Upgrade if not on the latest version.


We use `make` to run a lot of commands in the terminal from the project's root folder.
`make help` will show a list of all available make commands and their purposes.

### Make commands you should know in this project
`make package`: Builds and packages the application so you can drag the jar from the `deploy`-folder to the Application tab on an already running Enonic Server.

#### Updating dependencies
If you change package.json so it is no longer in sync with the package-lock.json, building of the application will fail, because the `ci` command we use to install packages safely will not allow this.

If you update package.json on purpose, you will need to `make install_new_dependencies` before building the application again.

If you update the `node` or `npm` versions in the build.gradle files, which the packages are dependent on, simply delete the .gradle folders, and run `make install_new_dependencies` before running `make` again.

If you upgrade `gradleVersion` in the code/build.gradle file, simply delete the code/.gradle folder, and run `gradle wrapper` inside the `code` folder.

#### Other relevant commands
Note that all these commands will first run any tasks they depend upon.
`make lint`: Run lint only. Note that linting is also run pre-commit. Your IDE should also continuously tell you about any linting errors if configured properly.
`make clean`: Delete all dependencies and build folders.
`make`: Alias for `make package`, which packages the application.
