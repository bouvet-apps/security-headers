.PHONY: default help prepare configure build install_new_dependencies lint package clean

SRC_DIR := $(shell pwd)
STAMPS_DIR := $(SRC_DIR)/.stamps

CODE_DIR := $(SRC_DIR)/code
APPLICATION_DIR := $(CODE_DIR)/src/main

APP_NAME := $(shell cd $(CODE_DIR) && ./gradlew appName -q)
APP_VERSION := $(shell cd $(CODE_DIR) && ./gradlew appVersion -q)

GIT_HOOKS := $(SRC_DIR)/.git/hooks
GIT_HOOKS_DIR := $(SRC_DIR)/scripts/hooks
GIT_HOOKS_SOURCES := $(shell find $(GIT_HOOKS_DIR))

DIST_DIR := $(CODE_DIR)/build/libs
PACKAGE_TARGET := $(DIST_DIR)/$(APP_NAME)-$(APP_VERSION).jar

# List of source files
APPLICATION_SOURCES := $(CODE_DIR)/build.gradle $(CODE_DIR)/package.json $(CODE_DIR)/settings.gradle $(CODE_DIR)/gradle.properties $(CODE_DIR)/.babelrc $(shell find $(APPLICATION_DIR) -name "*")
SOURCES := $(APPLICATION_SOURCES)

default: package ## Default target when running make without specifying a target, runs package

help: ## Print this text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

prepare: $(STAMPS_DIR)/prepare.stamp ## Install external tools and validate environment
$(STAMPS_DIR)/prepare.stamp: Makefile .git/hooks | $(STAMPS_DIR)
	## Check that git, gradle, java, node, enonic cli, etc --> sdkman
	## Install git hooks
	$(call check_external,git)
	$(call check_external,gradle)
	$(call check_external,java)
	$(call check_external,node)
	$(call check_external,enonic)
	@touch $@

configure: $(STAMPS_DIR)/configure.stamp ## Install project dependencies. E.g. pip install, npm install etc
$(STAMPS_DIR)/configure.stamp: $(STAMPS_DIR)/prepare.stamp | $(STAMPS_DIR)
	@touch $@

build: $(STAMPS_DIR)/build.stamp ## Optional build step, needed by compiled or transpiled languages
$(STAMPS_DIR)/build.stamp: $(STAMPS_DIR)/configure.stamp $(SOURCES) | $(STAMPS_DIR)
	# RUNNING Build
	@cd $(CODE_DIR) && ./gradlew npmBuild
	@touch $@

install_new_dependencies:
	@cd $(CODE_DIR) && ./gradlew npm_install

lint: $(STAMPS_DIR)/lint.stamp ## Checks if the code is written according to the styleguide.
$(STAMPS_DIR)/lint.stamp: $(STAMPS_DIR)/configure.stamp $(SOURCES) | $(STAMPS_DIR)
	# RUNNING Lint
	@cd $(CODE_DIR) && ./gradlew npmLint
	@touch $@

package: $(PACKAGE_TARGET) ## Create a deployment package
$(PACKAGE_TARGET): $(STAMPS_DIR)/build.stamp $(STAMPS_DIR)/lint.stamp | $(DIST_DIR)
	# RUNNING Packaging
	@cd $(CODE_DIR) && ./gradlew packageApplication

clean: ## Delete generated files
	# RUNNING Cleaning up
	@cd $(CODE_DIR) && ./gradlew clean
	-rm -rf $(STAMPS_DIR)
	-rm -rf $(CODE_DIR)/node_modules
	-rm -rf $(CODE_DIR)/build/private-libs

$(STAMPS_DIR):
	@mkdir -p $@

$(DIST_DIR):
	@mkdir -p $@

git-hooks: .git/hooks ## Installs the git-hooks
.git/hooks: $(GIT_HOOKS_SOURCES)
	rsync -avu --delete "$(GIT_HOOKS_DIR)/" "$@"
	chmod +x $@/*
	@touch $@

define check_external
	@if ! command -v $(1) >/dev/null 2>&1; then \
		echo "You have to install $(1)"; \
		exit 1; \
	fi
endef
