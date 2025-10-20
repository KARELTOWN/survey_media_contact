import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { __dirname } from "../../index.js";
import _ from "lodash";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";
import FileUpload from "../../models/File.js";

export default function fileService() {
  const clientS3 = new S3Client({
    region: process.env.WAZA_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.WAZA_ACCESS_KEY_ID,
      secretAccessKey: process.env.WAZA_SECRET_ACCESS_KEY,
    },
  });

  const uploadFileInJsonOnS3 = async (file, filePath) => {
    try {
      let extension = file.originalname.split(".").pop();
      const params = {
        Bucket: process.env.WAZA_BUCKET,
        Body: file.buffer,
        Key: `${filePath}/file_${Date.now() + v4()}.${extension}`,
        Acl: "private",
      };
      const command = new PutObjectCommand(params);
      const save = await clientS3.send(command);
      if (save) {
        return params.Key;
      }
    } catch (err) {
      console.error("Erreur lors de l'upload JSON vers S3 :", err);
    }
  };

  const presignedUpload = (key, mimetype) => {
    let url = getSignedUrl("putObject", {
      Bucket: process.env.WAZA_BUCKET,
      Key: key,
      Expires: "3600", //time to expire in seconds
    });
    return url;
  };

  // function getPublicFileUrl(key, zone) {
  //   return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${key}`;
  // }

  const getFileOnS3 = async (file_id) => {
    const file_upload = await FileUpload.findById(file_id);
    // Get chuck from S3 Storage
    let url_file = presignedUpload(file_upload.path, file_upload.mimetype);
    return url_file;
  };

  return {
    getFileOnS3,
    uploadFileInJsonOnS3,
  };
}
