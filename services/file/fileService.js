import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { __dirname } from "../../index.js";
import _ from "lodash";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 } from "uuid";
import FileUpload from "../../models/FileUpload.js";
import fs from "fs";
import path from "path";

export default function fileService() {
  const clientS3 = new S3Client({
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_ENDPOINT || undefined, // utile pour Wazabi
  });

  const uploadTempFileOnS3 = async (temp_filename, filePath) => {
    try {
      let [file, tmpFilePath] = await readFileFromFolder(temp_filename, "utf8");
      const buffer = Buffer.from(file.base64, "base64");
      delete file.base64;
      file.buffer = buffer;
      let filename = await uploadFileOnS3(file, filePath);
      if (filename) {
        let file_save = await FileUpload.insertOne({
          path: `${filePath}/${filename}`,
          original_name: Buffer.from(file.originalname, "utf8").toString(),
          name: filename,
          mimetype: file.mimetype,
        });
        if (file_save._id !== undefined && file_save._id) {
          fs.unlinkSync(tmpFilePath);
          return file_save._id;
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const uploadFileOnS3 = async (file, filePath) => {
    try {
      let extension = file.originalname.split(".").pop();
      let filename = `file_${Date.now() + v4()}.${extension}`;
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Body: file.buffer,
        Key: `${filePath}/${filename}`,
        Acl: "private",
      };
      const command = new PutObjectCommand(params);
      const save = await clientS3.send(command);
      if (save) {
        return filename;
      }
    } catch (err) {
      console.error("Erreur lors de l'upload JSON vers S3 :", err);
    }
  };

  const presignedUpload = async (key) => {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    });

    const url = await getSignedUrl(clientS3, command, { expiresIn: 3600 });
    return url;
  };

  // function getPublicFileUrl(key, zone) {
  //   return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${key}`;
  // }

  const getFileOnS3 = async (key) => {
    // Get chuck from S3 Storage
    let url_file = await presignedUpload(key);
    return url_file;
  };

  const uploadInFileLocal = async (file) => {
    try {
      let folder = path.join(__dirname, "storage/tmp");

      checkFolder(folder);
      let filename = `tmp_${Date.now() + v4()}.json`;

      const filePath = path.join(folder, filename);

      const base64 = file.buffer.toString("base64");
      const data = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        base64,
      };

      fs.writeFileSync(filePath, JSON.stringify(data));
      return filename;
    } catch (err) {
      console.error("Erreur lors du zip de chunk:", err);
    }
  };

  const checkFolder = (folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true }); // pour créer tous les niveaux de dossiers nécessaires . Sans recursive, seul le premier dossier (storage) sera créé
    }
  };

  const readFileFromFolder = async (temp_filename, format = null) => {
    try {
      let filePath = path.join(__dirname, "storage/tmp", temp_filename);
      const filedata = fs.readFileSync(filePath, format);
      let file = JSON.parse(filedata);
      return [file, filePath];
    } catch (error) {
      throw new Error(error);
    }
  };

  const deleteFile = (filepath) => {
    try {
      fs.unlinkSync(filepath);
      console.log("🗑️ Fichier supprimé :", e);
    } catch (error) {
      console.error("Erreur suppression :", error.message, "→", filepath);
    }
  };

  return {
    getFileOnS3,
    uploadFileOnS3,
    readFileFromFolder,
    uploadInFileLocal,
    uploadTempFileOnS3,
    deleteFile,
  };
}
