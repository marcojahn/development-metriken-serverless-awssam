Beistellungen für SEEC
[ ] a) Docker Image mit allen Tools (alpine-*)
[ ] b) Alle Installer Befehle für gitlab-ci
[ ]
[ ] POC auf CDK aufrüsten
[ ] LambdaVPC Config einfügen für "testing" in SEEC Umgebung
    - als Parameter ans Makefile (im Detail dann sehen mit Christian)
    -> VPC import (CloudFormation Value)
      LambdaSecurityGroup:
        Type: AWS::EC2::SecurityGroup
        Properties:
          VpcId:
            Fn::ImportValue: VPC1-VPC-ID
          GroupDescription: Security Group for Lambda
      MagicLambda
        Type: AWS::SERVERLESS::FUNCTION
        Properties
          VpcConfig:
            SecurityGroupIds:
              - !Ref LambdaSecurityGroup
            SubnetIds:
              - !ImportValue VPC1-AZ2Subnet1
[ ] Tagging gerade ziehen
[ ] Verschlüsselung "überall" (S3)
[ ] Secrets an Lambdas geben (tokens, ...)



[x] tagging "globaler parametrisieren"
[ ] naming für Application und Environment klar ziehen
[x] nested stack deployments
[x] nested stack Makefile scripting
[x] informationen stack(app)/branch/environment konsolidieren
  - SNS Topic!!
[x] Stacks finden für autom. Tagging bei Nested Application
[ ] 
[ ] Durchläufe fixen (überall nen build...)
[ ] - Tests (unit)
[ ] JobScanner mal in Java mit vorhandenem Regex Zeugs (Benchmarken gegen TypeScript)
[ ] auf CDK umstellen ?
[ ] 
[ ] DOKU!!!
[ ] 
 _ .-') _  _  .-')               .-') _               ('-.       .-') _  _ .-') _   
( (  OO) )( \( -O )             ( OO ) )            _(  OO)     ( OO ) )( (  OO) )  
 \     .'_ ,------.  ,-.-') ,--./ ,--,'  ,----.    (,------.,--./ ,--,'  \     .'_  
 ,`'--..._)|   /`. ' |  |OO)|   \ |  |\ '  .-./-')  |  .---'|   \ |  |\  ,`'--..._) 
 |  |  \  '|  /  | | |  |  \|    \|  | )|  |_( O- ) |  |    |    \|  | ) |  |  \  ' 
 |  |   ' ||  |_.' | |  |(_/|  .     |/ |  | .--, \(|  '--. |  .     |/  |  |   ' | 
 |  |   / :|  .  '.',|  |_.'|  |\    | (|  | '. (_/ |  .--' |  |\    |   |  |   / : 
 |  '--'  /|  |\  \(_|  |   |  | \   |  |  '--'  |  |  `---.|  | \   |   |  '--'  / 
 `-------' `--' '--' `--'   `--'  `--'   `------'   `------'`--'  `--'   `-------' 
[ ] Die Timeouts für die SQS Queues und die Abnehmer anpassen
-> zuviele retries!!!
[ ] 
[ ] XRay & Insights -> AWS SAM
[ ] META Infos (entweder 2 Props, payload & meta, oder ein meta)
[ ] Infos für Meta https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
[x] Durchlaufzeiten (Meta)
[x] Approximate Receives pro Lambda (Meta)
[ ] Correlation ID ?
[x] ZielDokument auf S3
[ ] 
[ ] Monitoring/Metrics
[ ] 
[ ] Lambda retries -> nicht 5x
[x] Lambdas auseinander bauen
[ ] Lambda: Environment, DLQ, FunctionName
[ ] Monitoring auf DQLs und DataTypeWithoutConsumerQueue
[ ] LOCAL DEV ENABLES !!!
[ ] 
[x] Tags auf die Log Groups
[ ] 
[x] S3 bucket struktur
  - sam build -> <s3>/build/artifacts
[ ] 
[ ] Budget automatisieren
  https://awscli.amazonaws.com/v2/documentation/api/latest/reference/budgets/create-budget.html
[ ] Tooling
  cfn-lint (-> vs code)
  https://github.com/aws-scripting-guy/cform-VSCode/releases
  https://marketplace.visualstudio.com/items?itemName=dsteenman.cloudformation-yaml-snippets