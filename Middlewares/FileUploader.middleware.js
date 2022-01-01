import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/songs");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.songId}.${file.originalname.split(".")[1]}`);
  },
});

const FileUploader = multer({ storage: storage });

export default FileUploader;
