import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: UserProfile
}

export default observer(function FollowButton({profile}: Props) {
    const {userStore, profileStore: {loading, updateFollowing}} = useStore();

    if (userStore.user?.userName === profile.userName) return null;

    function handleFollow(e: SyntheticEvent, userName: string) {
        e.preventDefault();
        updateFollowing(userName, !profile.following);
    }

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{width: '100%'}}>
                <Button 
                    fluid 
                    color='teal' 
                    content={profile.following ? 'Following' : 'Not following'} 
                />
            </Reveal.Content>
            <Reveal.Content hidden style={{width: '100%'}}>
                <Button 
                        fluid
                        basic
                        color={profile.following ? 'red' : 'green'} 
                        content={profile.following ? 'Unfollow' : 'Follow'} 
                        loading={loading}
                        onClick={(e) => handleFollow(e, profile.userName)}
                />
            </Reveal.Content>
        </Reveal>
    );
})