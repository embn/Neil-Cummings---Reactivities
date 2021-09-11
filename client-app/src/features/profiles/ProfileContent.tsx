import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import { UserProfile } from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import ProfilePhotos from "./ProfilePhotos";

interface Props {
    profile: UserProfile;
}
export default observer(function ProfileContent({profile}:Props) {
    const {profileStore} = useStore();
    const panes = [
        {menuItem: 'About', render: () => <ProfileAbout profile={profile} />},
        {menuItem: 'Photos', render: () => <ProfilePhotos profile={profile} />}, 
        {menuItem: 'Activities', render: () => <Tab.Pane>Activities Content</Tab.Pane>}, 
        {menuItem: 'Followers', render: () => <ProfileFollowings />}, 
        {menuItem: 'Following', render: () => <ProfileFollowings />}, 
    ]
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => profileStore.setActiveTab(data.activeIndex as number)}
        />
    );
})