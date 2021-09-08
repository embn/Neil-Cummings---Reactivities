import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";
import UpdateForm from "./ProfileEditForm";

interface Props {
    profile: UserProfile;
}

export default observer(function ProfileAbout({profile}: Props) {

    const { profileStore: {isCurrentUser} } = useStore();
    const [editMode, setMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile.displayName}`} />
                    {isCurrentUser && ( 
                        <Button floated='right' 
                                basic 
                                content={editMode ? 'Cancel' : 'Edit Profile'} 
                                onClick={() => setMode(!editMode)}  />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <UpdateForm profile={profile} setEditMode={setMode}/>
                    ) : (
                        <span style={{whiteSpace: 'pre-wrap'}}>
                            {profile.bio}
                        </span>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});