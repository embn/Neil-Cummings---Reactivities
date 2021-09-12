import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import { dateFormat } from '../../../app/common/globalization/dateFormat';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer (function ActivityDetailedHeader({activity}: Props) {
    const {activityStore: {updateAttendance, loading, cancelActivityToggle}} = useStore()
    return (
        <Segment.Group>
            {activity.isCancelled &&
                <Label ribbon color='red' content='Cancelled' style={{position: 'absolute ', zIndex: 1000, 
                       left: -14, top: 20}} />
            }
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date!, dateFormat)}</p>
                                <p>
                                    Hosted by  
                                    <strong>
                                        <Link to={`/profile/${activity.host?.userName}`}>
                                            {activity.host?.displayName}
                                        </Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <>
                        <Button color={activity.isCancelled ? 'green' : 'red' } 
                                content={activity.isCancelled ? 'Re-activate Activity' : 'Cancel Activity' }
                                floated='left' basic onClick={cancelActivityToggle} loading={loading} />

                        <Button disabled={activity.isCancelled} as={Link} to={`/manage/${activity.id}`}color='orange' floated='right'>
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ? (
                    <Button disabled={activity.isCancelled} onClick={updateAttendance} loading={loading}>Cancel attendance</Button>
                ) : (
                    <Button disabled={activity.isCancelled} onClick={updateAttendance} loading={loading} color='teal'>Join Activity</Button>
                )}
                
               
                
            </Segment>
        </Segment.Group>
    )
})