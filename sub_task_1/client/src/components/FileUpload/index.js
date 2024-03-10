import { UploadButton } from "@bytescale/upload-widget-react";
import { Button } from "grommet";
import { Upload } from "grommet-icons";


const options = {
    apiKey: process.env.REACT_APP_FILEUPLOAD_PUBLIC_KEY,
    maxFileCount: 1,
    "mimeTypes": [
        "image/jpeg"
    ],
};

const FileUpload = ({ onUpload }) => (
    <UploadButton options={options}
        accept="image/*"
        onComplete={files => onUpload && files.length > 0 && onUpload(files[0].fileUrl)}>
        {({ onClick }) =>
            <Button icon={<Upload />} label="Upload Image" onClick={onClick} style={{ width: "60%" }} margin={{ top: "small" }} />
        }
    </UploadButton>
)

export default FileUpload