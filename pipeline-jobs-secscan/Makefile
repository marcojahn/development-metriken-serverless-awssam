validate:
	sam validate

__deploy: ##=> deploy core service
	$(info [*] Packaging and deploying Loyalty service...)
	sam package \
		--s3-bucket $${DEPLOYMENT_BUCKET_NAME} \
		--s3-prefix build/artifacts \
		--output-template-file packaged.yaml && \
	sam deploy \
		--template-file packaged.yaml \
		--stack-name $${STACK_NAME}-PipelineJobsSecurityScanner-$${STACK_BRANCH} \
		--capabilities CAPABILITY_IAM \
		--tags Name=devmetrics \
		--parameter-overrides \
			Stage=$${STACK_BRANCH} \
			WorkerSNSTopic=/$${STACK_BRANCH}/service/$${STACK_NAME}/messaging/workerTopic \
			GitLabToken=/$${STACK_BRANCH}/service/$${STACK_NAME}/gitlab/token \
			Bucket=$${DEPLOYMENT_BUCKET_NAME} && \
	$(MAKE) tags

tags:
	@echo --- Tagging Function Log Group ---
	$(eval _STACK_NAME=$(shell aws cloudformation describe-stacks --query 'Stacks[?contains(StackName, `${STACK_NAME}-${STACK_BRANCH}-PipelineJobsSecurityScanner`) == `true`].StackName' --output text))	
	@echo _STACK_NAME IS: $(_STACK_NAME)
	$(eval FUNC_NAME=$(shell aws cloudformation describe-stacks --stack-name ${_STACK_NAME} --query "Stacks[0].Outputs[?OutputKey=='GetMetaInfoFuncName'].OutputValue" --output text))
	@echo FUNC_NAME IS: $(FUNC_NAME)
	$(eval RESULT=$(shell aws logs tag-log-group --log-group-name /aws/lambda/$(FUNC_NAME) --tags Name=${STACK_NAME},Environment=${STACK_BRANCH))
	$(eval TAGS=$(shell aws logs list-tags-log-group --log-group-name /aws/lambda/$(FUNC_NAME) --output text))
	@echo TAGS FOR $(FUNC_NAME) ARE: $(TAGS)

	@echo --- Tagging Function Log Group ---
	$(eval _STACK_NAME=$(shell aws cloudformation describe-stacks --query 'Stacks[?contains(StackName, `${STACK_NAME}-${STACK_BRANCH}-PipelineJobsSecurityScanner`) == `true`].StackName' --output text))	
	@echo _STACK_NAME IS: $(_STACK_NAME)
	$(eval FUNC_NAME=$(shell aws cloudformation describe-stacks --stack-name ${_STACK_NAME} --query "Stacks[0].Outputs[?OutputKey=='ParseJobLogFuncName'].OutputValue" --output text))
	@echo FUNC_NAME IS: $(FUNC_NAME)
	$(eval RESULT=$(shell aws logs tag-log-group --log-group-name /aws/lambda/$(FUNC_NAME) --tags Name=${STACK_NAME},Environment=${STACK_BRANCH))
	$(eval TAGS=$(shell aws logs list-tags-log-group --log-group-name /aws/lambda/$(FUNC_NAME) --output text))
	@echo TAGS FOR $(FUNC_NAME) ARE: $(TAGS)

delete: ##=> deploy core service
	aws cloudformation delete-stack --stack-name $${STACK_NAME}-PipelineJobsSecurityScanner-$${STACK_BRANCH}
