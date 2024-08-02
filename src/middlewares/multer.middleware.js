// Temporarily Storing files on Server

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({ storage:storage });

/*

const storage = multer.diskStorage({
  destination:funtion(req,file,cd){
    cd(null,'./public/temp');
  },
  filename: function(req,file,cb){
    cb(null,`${Date.now()}-${file.originalname}`);
  }
})
export const upload = multer({storage:storage});

upload.fields[
  {
    name:'avatar',
    maxcount : 1,
  },
  {
    name:'coverImage',
    maxCount : 1
  }
]
  
 */

