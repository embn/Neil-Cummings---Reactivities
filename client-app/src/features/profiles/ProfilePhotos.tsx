import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, UserProfile } from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: UserProfile;
}

export default observer(function ProfilePhotos({profile}: Props) {

    const { profileStore: {isCurrentUser, uploadPhoto, uploadingPhoto, loadingPhoto, setMainPhoto, deletePhoto} } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [targetPhoto, setTargetPhoto] = useState('');

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }
    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTargetPhoto(e.currentTarget.name);
        setMainPhoto(photo);
    }
    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTargetPhoto(e.currentTarget.name);
        deletePhoto(photo);
    }
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && ( 
                        <Button floated='right' 
                                basic 
                                content={addPhotoMode ? 'Cancel' : 'Add Photo'} 
                                onClick={() => setAddPhotoMode(!addPhotoMode)}  />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploadingPhoto} />
                    ) : (
                        <Card.Group itemsPerRow={5} >
                            {profile.photos?.map(photo => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                basic
                                                color='green'
                                                content='Main'
                                                name={'main-' + photo.id}
                                                disabled={photo.isMain}
                                                loading={loadingPhoto && targetPhoto === 'main-' + photo.id }
                                                onClick={e => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button 
                                                basic 
                                                color='red' 
                                                icon='trash' 
                                                content='Delete'
                                                name={'delete-' + photo.id}
                                                disabled={photo.isMain}
                                                loading={loadingPhoto && targetPhoto === 'delete-' + photo.id }
                                                onClick={e => handleDeletePhoto(photo, e)}
                                                
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})