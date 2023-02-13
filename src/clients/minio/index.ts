var Minio = require('minio')
require('dotenv').config()

// Instantiate the minio client with the endpoint
const minioClient = new Minio.Client({
    endPoint: process.env['S3_BUCKET_END_POINT'],
    port: process.env['S3_BUCKET_PORT'],
    useSSL: true,
    accessKey: process.env['S3_BUCKET_ACCESS_KEY'],
    secretKey: process.env['S3_BUCKET_SECRET_KEY']
});

function uploadFilesToS3(bucketName: string, files: File[]): void {

  minioClient.makeBucket(bucketName, 'eu-west-1', function(e: Error) {
    if (e) {
      throw new Error("Exception while creating the s3 bucket: " + e)
    }

    const metaData = {
        'Content-Type': 'application/octet-stream',
        'X-Amz-Meta-Testing': 1234,
        'example': 5678
    }

    for (const file of files) {
      minioClient.fPutObject(bucketName, 'photos-europe.tar', file, metaData, function(e: Error, etag: any) {
        if (e) {
          throw new Error("Exception while uploading file to the s3 bucket: " + e)
        }
      });
    }
  });
}

export { minioClient, uploadFilesToS3 }
