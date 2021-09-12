import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { UserProfile, UserProfileFormValues } from "../../app/models/userProfile";
import * as yup from 'yup';
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: UserProfile;
    setEditMode: (mode: boolean) => void; 
} 
export default observer(function ProfileEditForm({profile, setEditMode}: Props) {
    const {profileStore: {updateProfile}} = useStore();
    return (
        <Formik 
            initialValues={{...new UserProfileFormValues(profile), error: null}}
            onSubmit={(values) => updateProfile(values).then(() => { setEditMode(false); })}
            validationSchema={yup.object({
                displayName: yup.string().required()
            })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' autoFocus={true}/>
                    <MyTextArea rows={3} placeholder='Add your bio' name='bio' />
                    <ErrorMessage 
                        name='error' 
                        render={() => 
                            <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />
                        }
                    />
                    <Button floated='right' loading={isSubmitting} positive content='Submit' type='Update Profile' 
                            disabled={isSubmitting || !dirty || !isValid} />
                </Form>
            )}
        </Formik>
    );
});