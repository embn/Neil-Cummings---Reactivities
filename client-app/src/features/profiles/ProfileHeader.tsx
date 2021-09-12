import { observer } from "mobx-react-lite";
import { Divider, Grid, Header, Item, Segment, Statistic } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import FollowButton from "./FollowButton";

interface Props {
    profile: UserProfile;
}
//even though this component doesn't need userStore functions, 
//we still need to observe the store in order to react to changes to the profile
export default observer(function ProfileHeader({profile}:Props) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1' content={profile.displayName}/>
                            </Item.Content>

                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group>
                        <Statistic label='Followers' value={profile.followersCount} />
                        <Statistic label='Following' value={profile.followingCount} />
                    </Statistic.Group>
                    <Divider />
                    <FollowButton profile={profile} />
                </Grid.Column>
            </Grid>
        </Segment>
    );
})