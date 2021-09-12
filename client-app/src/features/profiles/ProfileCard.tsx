import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import FollowButton from "./FollowButton";

interface Props {
    profile: UserProfile;
}

export default observer(function ProfileCard({profile}: Props) {
    function truncate(str: string | undefined) {
        if (str) {
            return str.length > 40 ? str.substring(0, 37) + "..." : str;
        }
    }

    return (
        <Card as={Link} to={`/profile/${profile.userName}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncate(profile.bio)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount} {profile.followersCount === 1 ? 'follower' : 'followers'}
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    );
})