import { Button, Card, Image } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";

export default function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity : activity, openForm, deselectActivity} = activityStore;

    if (!activity) return <Loading />;

    return (
        <Card fluid>
            {/* Backticks denotes a template literal */}
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
            <Card.Header>{activity.title}</Card.Header>
            <Card.Meta>
                <span>{activity.date}</span>
            </Card.Meta>
            <Card.Description>
                {activity.description}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit'/>
                    <Button onClick={deselectActivity} basic color='blue' content='Cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}