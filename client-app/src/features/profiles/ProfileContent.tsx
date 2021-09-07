import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
    profile: UserProfile;
}
export default observer(function ProfileContent({profile}:Props) {
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane>},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />}, 
        {menuItem: 'Activities', render: () => <Tab.Pane>Activities Content</Tab.Pane>}, 
        {menuItem: 'Followers', render: () => <Tab.Pane>Followers Content</Tab.Pane>}, 
        {menuItem: 'Following', render: () => <Tab.Pane>Following Content</Tab.Pane>}, 
    ]
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
        />
    );
})