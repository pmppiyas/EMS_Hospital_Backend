import fs from "fs";
import path from "path";

export const deleteAllFilesInUploads = () => {
  const folderPath = path.join(__dirname, "../../../uploads");

  console.log(folderPath);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading uploads folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", filePath, err);
        } else {
          console.log("Deleted:", filePath);
        }
      });
    });
  });
};
