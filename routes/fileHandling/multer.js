// middleware/uploadHandler.js
import multer from "multer";

export function Uploader({ maxSizeMB = 1, fieldName = "file" }) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "temp/uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
        if(!err){
            next()
        }
        const responseJson = {
            statusCode: 400,
            data: {},
            message: "Bad Request",
            code: "bad_request",
        };
        responseJson.data[fieldName] = `Size must be less than ${maxSizeMB} MB`
        if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json(responseJson);
        }
    });
  };
}
