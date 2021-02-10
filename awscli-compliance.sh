aws s3api create-bucket --bucket devmetrics-bucket --region eu-central-1 --create-bucket-configuration LocationConstraint=eu-central-1

aws s3api put-bucket-tagging --bucket devmetrics-bucket --tagging 'TagSet=[{Key=Name,Value=devmetrics}]'


aws s3api put-object --bucket devmetrics-bucket --key build/artifacts/