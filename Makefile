STACK_BRANCH ?= "dev" #TODO better naming
STACK_NAME ?= "UNDEFINED" # Application name
DEPLOYMENT_BUCKET_NAME ?= "UNDEFINED"

# TODO Tag handling

target:
	$(info ${HELP_MESSAGE})
	@exit 0

init: ##=> Install OS deps and dev tools
	$(info [*] Bootstrapping CI system...)
	@$(MAKE) _install_os_packages

validate:
	$(info [*] unhandled)

deploy: ##==> Deploy nested application
	$(info [*] Deploying nested stack...)
	sam package \
		--s3-bucket $${DEPLOYMENT_BUCKET_NAME} \
		--s3-prefix build/artifacts \
		--output-template-file packaged.yaml && \
	sam deploy \
		--template-file packaged.yaml \
		--stack-name $${STACK_NAME}-$${STACK_BRANCH} \
		--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --tags Name=$${STACK_NAME} \
		--parameter-overrides \
			Stage=$${STACK_BRANCH} \
			Name=$${STACK_NAME} \
			Bucket=$${DEPLOYMENT_BUCKET_NAME}

delete: ##==> Delete nested stack
	$(info [*] Deleting nested stack...)
	aws cloudformation delete-stack --stack-name $${STACK_NAME}-$${STACK_BRANCH}

deploy.single: ##==> Deploy Services
	$(info [*] Deploying...)
	$(MAKE) deploy.development-metrics-core
	$(MAKE) deploy.development-metrics-pipelinejobs-sec-scan

deploy.development-metrics-core: ## ==> Deploy core services
	$(info [*] Deploy core services)
	$(MAKE) -C core deploy

deploy.development-metrics-pipelinejobs-sec-scan: ## ==> Deploy pipeline jobs security scanner
	$(info [*] Deploy pipeline jobs security scanner)
	$(MAKE) -C pipeline-jobs-secscan deploy

delete.single:
	$(MAKE) -C core delete
	$(MAKE) -C pipeline-jobs-secscan delete

export.parameter:
	$(info [+] Adding new parameter named "${NAME}")
	aws ssm put-parameter \
		--name "$${NAME}" \
		--type "String" \
		--value "$${VALUE}" \
		--overwrite

#############
#  Helpers  #
#############

_install_os_packages:
	$(info [*] Installing os packages (currently disabled))
	# $(info [*] Installing jq...)
	# yum install jq -y
	# $(info [*] Upgrading Python SAM CLI and CloudFormation linter to the latest version...)
	# python3 -m pip install --upgrade --user cfn-lint aws-sam-cli
	# npm -g install aws-cdk

define HELP_MESSAGE

Environment variables:

These variables are automatically filled at CI time.
If doing a dirty/individual/non-ci deployment locally you'd need them to be set

STACK_BRANCH: "dev"
Description: Feature branch name used as part of stacks name

STACK_NAME: "development-metrics-dev-20210125130553"
Description: Stack Name already deployed; used for dirty/individual deployment


Common usage:

...::: Bootstraps environment with necessary tools like SAM CLI, cfn-lint, etc. :::...
$ make init

...::: Export parameter and its value to System Manager Parameter Store :::...
$ make export.parameter NAME="/env/service/amplify/api/id" VALUE="xzklsdio234"

endef