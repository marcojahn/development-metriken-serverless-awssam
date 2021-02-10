# TODOs
[ ] clarify 'as is' with Christian -> cdk-devmetrics, ...
[ ] env setup (dev, prd)
    https://docs.aws.amazon.com/cdk/latest/guide/environments.html

[ ] apply naming convention (tooling)
[ ] CDKTooling Deploy -> Tags Missing
[ ] "silent" handling of deploy/destroy
    https://github.com/aws/aws-cdk/issues/3894

[x] Lambda Log Group not removed when stack is deleted
[ ] Log Group has required tags ?

[ ] Passing Lambda VPC Configuration
  VpcConfig:
        SecurityGroupIds:
          - !Ref LambdaSecurityGroup
        SubnetIds:
          - !ImportValue VPC1-AZ2Subnet1

  https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_core.CfnRefElement.html
  https://garbe.io/blog/2019/09/20/hey-cdk-how-to-use-existing-resources/

[ ] tagging auf LogGroups
    https://github.com/aws-cloudformation/aws-cloudformation-resource-providers-logs/pull/53
[ ] tagging mittels Aspect überall (PflichtTags)

# Install CDK

    npm install -g aws-cdk


## Prerequisits
`aws configure` must be done before using (e.g. in Docker Env), see
https://docs.aws.amazon.com/cdk/latest/guide/cli.html#cli-options

## Create an app

    mkdir devmetrics
    cd devmetrics

    cdk init app --language=typescript \
        --toolkit-stack-name devmetrics

### Bootstrapping

    cdk.json
    ```json
    {
        // ...
        "context": {
            "@aws-cdk/core:newStyleStackSynthesis": "true",
            "@aws-cdk/core:bootstrapQualifier": "devmetrics"
        }
    }```

    ```bash
    cdk bootstrap \
        --qualifier devmetrics \
        --tags Name=devmetrics,SecondTag=FooBar \
        --show-template > bootstrap-template.yaml

    aws cloudformation create-stack \
        --stack-name CDKToolkit-devmetrics \
        --capabilities CAPABILITY_NAMED_IAM \
        --template-body file://bootstrap-template.yaml \
        --tags Key=Name,Value=devmetrics \
        --parameters ParameterKey=Qualifier,ParameterValue=devmetrics
    ```

### maybe for later
    cdk init --help

    --role-arn            ARN of Role to use when invoking CloudFormation


### Remove deployed stacks

    ```bash
    cdk destroy '*'
    ```

## Remove Bootstrap

https://github.com/aws/aws-cdk/issues/986

    ```bash
    cdk destroy

    # empty the cdktoolkit staging bucket
    aws s3 rm --recursive s3://$(aws s3 ls | grep cdk-devmetrics | cut -d' ' -f3) 

    # copy the name
    aws s3 ls | grep cdk-devmetrics
    
    # replace the name here
    aws s3 rb --force s3://NAMEHERE

    aws cloudformation delete-stack --stack-name CDKToolkit-devmetrics
    ```