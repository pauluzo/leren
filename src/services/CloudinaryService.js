import { Cloudinary as CoreCloudinary, Util } from "cloudinary-core";

const url = (publicId, options) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  const cl = CoreCloudinary.new();
  return cl.url(publicId, scOptions);
}

const openUploadWidget = (options, callback) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  window.cloudinary.openUploadWidget(scOptions, callback);
}

export async function fetchPhotos(imageTag, setter) {
  const options = {
    cloudName: 'paulo',
    format: 'json',
    type: 'list',
    version: Math.ceil(new Date().getTime() / 1000),
  };
  const urlPath = url(imageTag.toString(), options);

  fetch(urlPath)
  .then(res => res.text())
  .then(text => text ? setter(JSON.parse(text).resources.map(image => image.publicId)) : [])
  .catch(err => {
    console.log(err);
    alert("The image/video could not be fetched");
  });
}

export const beginUpload = tag => {
  const uploadOptions = {
    cloudName: "paulo",
    tags: [tag],
    uploadPreset: "okaforpaul26",
  };

  openUploadWidget(uploadOptions, (error, photos) => {
    if(!error) {
      if(photos.event === "success") {
        console.log(photos);
        console.log(photos.info.public_id);
      }
    } else {
      console.log(error);
    }
  })
}