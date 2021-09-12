import { observer } from "mobx-react-lite";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activeTab} = profileStore;
    let headerContent;
    if (activeTab === 3) {
        headerContent = `People following ${profile?.displayName}`;
    }
    if (activeTab === 4) {
        headerContent = `People ${profile?.displayName} is following`;
    }
    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated='left'
                        icon='user'
                        content={headerContent}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(profile => {
                            return <ProfileCard key={profile.userName} profile={profile} />
                        })}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})