cd..
aws lambda publish-layer-version --layer-name workorders-layer1 --content S3Bucket=workorders-2020,S3Key=workorders-layer1.zip --compatible-runtimes nodejs12.x
aws lambda publish-layer-version --layer-name workorders-layer2 --content S3Bucket=workorders-2020,S3Key=workorders-layer2.zip --compatible-runtimes nodejs12.x

aws lambda update-function-configuration --function-name workorders --layers arn:aws:lambda:us-east-1:254343964956:layer:workorders-layer1:2 arn:aws:lambda:us-east-1:254343964956:layer:workorders-layer2:1


npm run build:lambda:layer1
aws lambda publish-layer-version --layer-name workorders-layer1 --content S3Bucket=workorders-2020,S3Key=workorders-layer1.zip --compatible-runtimes nodejs12.x
aws lambda update-function-configuration --function-name workorders --layers arn:aws:lambda:us-east-1:254343964956:layer:workorders-layer1:6 arn:aws:lambda:us-east-1:254343964956:layer:workorders-layer2:1
