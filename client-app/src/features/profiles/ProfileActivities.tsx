import { observer } from "mobx-react-lite";
import { SyntheticEvent, useEffect } from "react";
import { Card, Grid, Header, Tab, TabProps } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";
import ProfileActivityCard from "./ProfileActivityCard";




interface Props {
    profile: UserProfile;
}

export default observer(function ProfileActivities({profile}: Props) {
    const {profileStore: {activities, loadingActivities, loadActivities}} = useStore();
    const panes = [
        { menuItem: 'Future Events', pane: { key: 'future' }},
        { menuItem: 'Past Events', pane: { key: 'past' }},
        { menuItem: 'Hosting Events', pane: { key: 'hosting' }},
    ];
    useEffect(() => {
        loadActivities(profile.userName);
    }, [loadActivities])

    function handleTabChange(e: SyntheticEvent, data: TabProps) {
        loadActivities(profile.userName, panes[data.activeIndex as number].pane.key)
    }
    return (
        
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                <Header floated='left' icon='calendar' content={`Activities`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{secondary: true, pointing: true}}
                        panes={panes}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}>
                        {activities.map(a => {
                            return <ProfileActivityCard key={a.id} activity={a} />
                        })}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})