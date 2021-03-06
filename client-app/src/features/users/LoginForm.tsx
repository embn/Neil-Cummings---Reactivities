import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";

export default observer(function LoginForm() {
    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{ email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(error => 
                setErrors({error: 'Invalid email or password'}))
            }
        >
            {({isSubmitting, errors}) => (
                <Form className='ui form'>
                    <Header as='h2' content='Log into Reactivities' color='teal' textAlign='center' />
                    <MyTextInput name='email' placeholder='Email' autoFocus={true}/>
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage 
                        name='error' 
                        render={() => 
                            <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />
                        }
                    />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                </Form>
            )}
        </Formik>
    );
})