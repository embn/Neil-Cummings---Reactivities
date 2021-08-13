import { SyntheticEvent } from "react";
import { useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/Activity";

interface Props {
    activities: Activity[];
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityList({activities, selectActivity, deleteActivity, submitting}: Props) {

    const [target, setTarget] = useState('');

    function handleDeleteActivity(e : SyntheticEvent<HTMLButtonElement>, id : string)
    {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                {/* Because we need to pass an argument to selectActivity, we need to use parentheses.
                                    To not invoke selectActivity on render it must be wrapped in an arrow function.
                                */}
                                <Button onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue' />
                                <Button 
                                    name={activity.id}
                                    onClick={(e) => handleDeleteActivity(e, activity.id)} 
                                    floated='right' 
                                    content='Delete' 
                                    color='red' 
                                    loading={submitting && target === activity.id}
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}