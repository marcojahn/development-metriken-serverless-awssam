# Requirements needed for serverless development

Repository will be handled as MonoRepo

## "Pipeline 1" Developer Tooling

* one time tasks/commands (e.g. BootStrap)
  * cdk bootstrap [ENVIRONMENTS..]
  * bootstrap löschen/clean der Umgebung

* simple commands against deployed stack/stage
  * cdk deploy '*' or [STACKS..]
  * cdk destroy '*' or [STACKS..]

## "Pipeline 2" CI/CD

* Build von Software
  * build, test, QA, ...
  * Technologien: Java, ... (, TypeScript)
    * TypeScript kann evtl. durch CDK erfolgen
  
* GitLab
  * Reihenfolge von Build-Stages + parallel
    * https://docs.gitlab.com/ee/ci/yaml/#needs
  * Teilweises deployen durch "Erkennung von Pfaden"
    * https://github.com/BastiPaeltz/gitlab-ci-monorepo
    * https://docs.gitlab.com/ee/ci/yaml/#onlychangesexceptchanges

## Docker
  * python
  * node.js
  * java
  * aws cli
  * aws sam (??)
  * aws cdk

  * https://github.com/adamjkeller/aws-cdk-docker
  * https://github.com/aws/aws-cdk
  * https://hub.docker.com/r/jonathanmorley/aws-cdk
  * https://github.com/lambci/docker-lambda
  * https://dev.to/vumdao/create-aws-cdk-image-container-43ei

