import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore;
    //need to tell the hook about type info
    const {id} = useParams<{id : string}>();

    useEffect(() => {
        if (id) loadActivity(id);
    }, /* dependencies */[id, loadActivity]);

    if (loadingInitial || !activity) return <Loading />;
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
                    <Button as={Link} to={`/manage/${activity.id}`}basic color='blue' content='Edit'/>
                    <Button as={Link} to='/activities' basic color='blue' content='Cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
});