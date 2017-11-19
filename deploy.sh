./package.sh
aws lambda update-function-code --function-name EggDate --zip-file fileb://eggdate.zip
