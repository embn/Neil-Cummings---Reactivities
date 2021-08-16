import { observer } from "mobx-react-lite";
import { ChangeEvent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';

export default observer(function ActivityForm() {

    const history = useHistory();
    const {activityStore} = useStore();
    const {loadingInitial, loading, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    //useEffect is run on render, and will re-run each time dependencies change
    useEffect(() => {
        //! is used to ignore typescript, since we expect no scenario in which loadActivity returns undefined
        if (id) 
            loadActivity(id).then(activity => setActivity(activity!));
        
    }, [id, loadActivity]);

    function handleSubmit() {
        if (activity.id) {
            updateActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`)
            });
            
        } else {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => {
                history.push(`/activities/${newActivity.id}`)
            });
        }
            
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
        //JS destructuring assignment
        const {name, value} = event.target;
        //JS spread syntax
        setActivity({...activity, [name]: value})
    }

    if (loadingInitial) return <Loading content='Loading activity...'/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='on' >
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit'/>
                <Button as={Link} to='/activities' floated='right' content='Cancel'/>
            </Form>
        </Segment>
    );
});