import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Image, List, Popup } from "semantic-ui-react";
import { UserProfile } from "../../../app/models/userProfile";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: UserProfile[];
}

export default observer(function ActivityListItemAttendee({attendees}:Props) {
    const followingStyle = {
        borderColor: 'orange',
        borderWidth: 3,
    };
    return (
        <List horizontal>
            {attendees.map(attendee => (
                    <Popup 
                        hoverable 
                        key={attendee.userName} 
                        trigger={
                        <List.Item key={attendee.userName} as={Link} to={`profile/${attendee.userName}`}>
                            <Image 
                                size='mini' 
                                circular 
                                src={attendee.image || '/assets/user.png'} 
                                style={attendee.following ? followingStyle : null}//style never applied?!
                            />
                        </List.Item>
                        }
                    >
                        <Popup.Content>
                            <ProfileCard profile={attendee} />
                        </Popup.Content>
                    </Popup>


                    
            ))}
        </List>
    );
})