import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Grid } from "semantic-ui-react";
import Loading from "../../app/layout/Loading";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default observer(function ProfilePage() {
    const {username} = useParams<{username: string}>();
    const {profileStore: {loadProfile, loadingProfile, profile, setActiveTab}} = useStore();

    useEffect(() => {
        loadProfile(username);
        return () => {
            setActiveTab(0);
        }
    }, [loadProfile, setActiveTab, username] );

    if (loadingProfile) 
        return <Loading content='Loading profile...'/>
    return (
        <Grid>
            <Grid.Column width={16}>
                {/* For some reason the bang operator wouldn't work here */}
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile}/>
                    </>
                }
                
            </Grid.Column>
        </Grid>
    );
})