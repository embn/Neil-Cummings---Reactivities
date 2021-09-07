import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropZone from "./PhotoWidgetDropZone";

interface MyFile extends File {
    preview : string;
}
interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {
    
    const [files, setFiles] = useState<MyFile[]>([]);
    const [cropper, setCropper] = useState<Cropper>()

    function onCrop() {
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
        }
    }
    function onCancelCrop() {
        setFiles([]);
    }

    useEffect(() => {
        //ObjectURL will hang out in memory if not cleaned up
        return () => {
            files.forEach((file: MyFile) => URL.revokeObjectURL(file.preview))
        }
    }, [files])

    return (
        <Grid>
            <Grid.Column width={4}>
                <Header color='teal' content='Step 1 - Add Photo' sub />
                <PhotoWidgetDropZone setFiles={setFiles} />
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header color='teal' content='Step 2 - Resize Image' sub />
                {files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
                )}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column width={4}>
                <Header color='teal' content='Step 3 - Preview & Upload' sub />
                <div className='image-preview' style={{minHeight: 200, overflow: 'hidden'}}/>
                <Button.Group widths={2}>
                {files.length > 0 && (
                    <>
                        <Button loading={loading} onClick={onCrop} positive icon='check' />
                        <Button disabled={loading} onClick={onCancelCrop} icon='close' />
                    </>
                )}
                </Button.Group>
            </Grid.Column>
            <Grid.Column width={1} />
        </Grid>
    );
}