import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import { UserActivity, UserProfile } from "../../app/models/userProfile";

interface Props {
    activity: UserActivity;
}

export default observer(function ProfileActivityCard({activity}: Props) {
    return (
        <Card as={Link} to={`/activities/${activity.id}`}>
            <Image 
                style={{ minHeight: 100, ojectFit: 'cover' }} 
                src={`/assets/categoryImages/${activity.category}.jpg` || '/assets/placeholder.png'} 
            />
            <Card.Content>
                <Card.Header textAlign='center'>{activity.title}</Card.Header>
                <Card.Meta textAlign='center'>
                    <div>{format(new Date(activity.date), 'do LLL')}</div>
                    <div>{format(new Date(activity.date), 'HH:mm')}</div>
                </Card.Meta>
            </Card.Content>
            
            {/* <Card.Content extra>
                
            </Card.Content> */}
        </Card>
    );
})