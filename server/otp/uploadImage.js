var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dskqkgbbq', 
    api_key: '842911467567667', 
    api_secret: 'WHrqCE7kEBTvx09SHFfYTysDBB4' 
  });

  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  const uploadImage = (image) => { //image is converted to base64
    // console.log(image)
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.unsigned_upload(image,'newupload',(error,result)=>{
            if (result && result.secure_url) {
                // console.log(result.secure_url);
                return resolve(result.secure_url);
            }
            console.log(error.message);
            return reject({message: error.message});
        });
    });
  };