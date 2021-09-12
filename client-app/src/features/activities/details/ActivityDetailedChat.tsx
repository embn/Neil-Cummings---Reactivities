import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import { ChatCommentFormVaues } from '../../../app/models/comment';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns/esm';

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId}: Props) {
    const {commentStore} = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }
        return () => {//run on close component
            commentStore.clearComments();
            commentStore.stopHubConnection();
        }
    }, [commentStore, activityId]) 
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    <Formik onSubmit={(values, {resetForm}) => commentStore.addComment(values as ChatCommentFormVaues).then(() => resetForm())}
                            initialValues={{body: '' }}
                            validationSchema={Yup.object({
                                body: Yup.string().required(),
                                
                            })}
                        >
                            {({isSubmitting, isValid, handleSubmit}) => (
                                <Form className='ui form'>

                                    <Field name='body'>
                                        {(props: FieldProps) => (
                                            <div style={{ position: 'relative' }}>
                                                <Loader active={isSubmitting} />
                                                <textarea 
                                                    placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                                                    rows={2}
                                                    {...props.field}
                                                    onKeyPress={e => {
                                                        if (e.key === 'Enter' && e.shiftKey) {
                                                            return;
                                                        }
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            isValid && handleSubmit();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                        )}
                                    </Field>
                                </Form>
                            )}
                        </Formik>
                    
                     {commentStore.comments.map((comment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'}/>
                            <Comment.Content>
                                {comment.authorName ? 
                                    (
                                        <Comment.Author as={Link} to={`/profile/${comment.authorName}`}>
                                            {comment.authorDisplayName}
                                        </Comment.Author>
                                    ) : (
                                        <Comment.Author style={{fontStyle: 'italic', color: 'grey'}}>
                                            deleted user
                                        </Comment.Author>) }
                                
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                                {/* <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                </Comment.Actions> */}
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>

    )
})