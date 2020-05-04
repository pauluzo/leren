import { Cloudinary as CoreCloudinary, Util } from "cloudinary-core";
import { addUserVideo } from "../components/logic";

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

export const beginUpload = (tag, userData, videoDetails) => {
  const uploadOptions = {
    cloudName: "paulo",
    tags: [tag],
    uploadPreset: "okaforpaul26",
  };

  openUploadWidget(uploadOptions, (error, videoData) => {
    if(!error) {
      if(videoData.event === "success") {
        addUserVideo(userData, videoData.info, videoDetails);
      }
    } else {
      console.log(error);
      alert(`Could not upload video successfully. Please try again.`)
    }
  })
}