.PHONY: default help prepare install_new_dependencies build lint package clean

SRC_DIR := $(shell pwd)
STAMPS_DIR := $(SRC_DIR)/.stamps

CODE_DIR := $(SRC_DIR)/code

GIT_HOOKS_DIR := $(SRC_DIR)/scripts/hooks
GIT_HOOKS_SOURCES := $(shell find $(GIT_HOOKS_DIR))

DIST_DIR := $(CODE_DIR)/build/libs

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

install_new_dependencies:
	@cd $(CODE_DIR) && ./gradlew npm_install

build: $(STAMPS_DIR)/prepare.stamp ## Optional build step, needed by compiled or transpiled languages
	# RUNNING Build
	@cd $(CODE_DIR) && ./gradlew npmBuild

lint: $(STAMPS_DIR)/prepare.stamp ## Checks if the code is written according to the styleguide.
	# RUNNING Lint
	@cd $(CODE_DIR) && ./gradlew npmLint

package: $(STAMPS_DIR)/prepare.stamp ## Create a deployment package
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
