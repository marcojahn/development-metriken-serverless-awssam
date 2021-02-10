Naming Schema

Bei Nested Stacks
<Application/Name>-<Environment>[-<Domain>]-<ResourceName>

Application/Name
- devmetrics

Environment
- dev
- uat
- ...

Domain (max 10/12 -> shortcuts)
- core (was besseres)
- PipelineJobScanner (PJS)
- GitLabRepositoriesSizes (GLRSizes)
- GitLabRepositoriesMembers (GLRMembers)
- GitLabRepositoriesUsers (GLRUSers)
- AWSInventar

ResourceName
- Topics -> bessere Namen
https://jimmybogard.com/message-naming-conventions/
-- Command -> *Cmd -> ParseJobLogCmd / ParseJobLogCommand
-- Event -> GitLabItemHappened ???

Beispiel
devmetrics-dev-


---

Logs insights

filter @type="REPORT"
| fields @timestamp, @message, @duration, @billedDuration, @maxMemoryUsed/1024/1024
| sort @timestamp desc
| limit 20


--- read s3 file to stdout
aws s3 cp --quiet s3://devmetrics-bucket/dev/pipeline-jobs-secscan/file.json -

---

sam package --s3-bucket devmetrics-bucket --s3-prefix build/artifacts --output-template-file packaged.yaml

sam deploy --template-file packaged.yaml --stack-name devmetrics-dev --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND --tags Name=devmetrics



create-bucket

  ❯ aws s3api get-bucket-tagging --bucket devmetrics-bucket
  {
      "Location": "http://devmetrics-bucket.s3.amazonaws.com/"
  }


make deploy DEPLOYMENT_BUCKET_NAME=devmetrics-bucket STACK_NAME=devmetrics STACK_BRANCH=dev

make delete DEPLOYMENT_BUCKET_NAME=devmetrics-bucket STACK_NAME=devmetrics STACK_BRANCH=dev







outdated
core\

  make deploy DEPLOYMENT_BUCKET_NAME=devmetrics-bucket STACK_NAME=devmetrics STACK_BRANCH=dev

  make delete DEPLOYMENT_BUCKET_NAME=devmetrics-bucket STACK_NAME=devmetrics STACK_BRANCH=dev

  aws cloudformation describe-stacks --stack-name devmetrics-dev-Core-REZCTG7QHHSX --query "Stacks[0].Outputs[?OutputKey=='CoreFuncName'].OutputValue" --output text

  aws logs tag-log-group --log-group-name /aws/lambda/devmetrics-dev-Core-REZCTG7QHHSX-CoreFunc-7T3OWM33G0YP --tags Name=devmetrics

  aws logs list-tags-log-group --log-group-name /aws/lambda/devmetrics-dev-Core-REZCTG7QHHSX-CoreFunc-7T3OWM33G0YP

secscanner

  make deploy.development-metrics-pipelinejobs-sec-scan DEPLOYMENT_BUCKET_NAME=devmetrics-bucket STACK_NAME=devmetrics STACK_BRANCH=dev

  make tags DEPLOYMENT_BUCKET_NAME=devmetrics-bucket STACK_NAME=devmetrics STACK_BRANCH=dev




# SNS Topic Policy
when using "anything-but" the existence of the used property itself is mandatory.
When the property is not available the filter will NOT apply!