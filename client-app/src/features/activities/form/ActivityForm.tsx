import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import Loading from "../../../app/layout/Loading";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';
import { Formik, Form } from "formik";
import * as yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MyTextSelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";
import { dateTimeFormat } from "../../../app/common/lozalization/dateFormat";


export default observer(function ActivityForm() {

    const history = useHistory();
    const {activityStore} = useStore();
    const {loadingInitial, loading, createActivity, updateActivity, loadActivity} = activityStore;
    const {id} = useParams<{id: string}>();
    const validationSchema = yup.object({
        title: yup.string().required('The activity title is required.'),
        description: yup.string().required('The activity description is required.'),
        category: yup.string().required(),
        date: yup.string().required('Date is required').nullable(),
        venue: yup.string().required(),
        city: yup.string().required(),

    })
    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        description: '',
        category: '',
        date: null,
        venue: '',
        city: ''
    });

    //useEffect is run on render, and will re-run each time dependencies change
    useEffect(() => {
        //! is used to ignore typescript, since we expect no scenario in which loadActivity returns undefined
        if (id) 
            loadActivity(id).then(activity => setActivity(activity!));
        
    }, [id, loadActivity]);

    function handleFormSubmit(activity : Activity) {
        if (activity.id) {
            updateActivity(activity).then(() => { history.push(`/activities/${activity.id}`) });
            
        } else {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => { history.push(`/activities/${newActivity.id}`) });
        }
    }

    if (loadingInitial) return <Loading content='Loading activity...'/>

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal'/>
            <Formik 
                validationSchema={validationSchema}
                initialValues={activity} 
                enableReinitialize 
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >
                        <MyTextInput placeholder='Title' name='title' />
                        <MyTextArea rows={3} placeholder='Description' name='description'/>
                        <MyTextSelectInput options={categoryOptions} placeholder='Category' name='category'/>
                        <MyDateInput 
                            placeholderText='Date' 
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat={dateTimeFormat}
                            timeFormat='HH:mm'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <MyTextInput placeholder='City' name='city'/>
                        <MyTextInput placeholder='Venue' name='venue'/>
                        <Button 
                            content='Submit'
                            loading={loading}
                            floated='right'
                            positive type='submit'
                            disabled={isSubmitting || !dirty || !isValid}
                        />
                        <Button content='Cancel' as={Link} to='/activities' floated='right' />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});