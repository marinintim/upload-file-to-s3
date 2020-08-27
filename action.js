const core = require('@actions/core')
const aws = require('aws-sdk')
const fs = require('fs')

try {
  const filename = core.getInput('filename')
  const bucket = core.getInput('bucket')
  const endpointHost = core.getInput('endpoint')
  const accessKey = core.getInput('accessKey')
  const secretKey = core.getInput('secretKey')
  const acl = core.getInput('acl')

  const endpoint = new aws.Endpoint(endpointHost)
const s3 = new aws.S3({
    endpoint,
    accessKeyId: accessKey,
    secretAccessKey: secretKey
  })

  const params = {
    Bucket: bucket,
    Key: filename,
    Body: fs.createReadStream(filename),
    ACL: acl
  }
  s3.putObject(params, function(err, data) {
    if (err) {
      return core.setFailed(err.message)
    }
    console.log(data)
    core.setOutput('s3-upload', JSON.stringify(data, null, 2))
  })
} catch (error) {
  core.setFailed(error.message)
}
