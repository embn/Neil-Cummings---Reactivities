import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, Loader } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";


export default observer(function ActivityDashboard() {
    // destructuring the activityStore property from the Store object returned
    const {activityStore} = useStore();
    const {loadActivities, activities, setPagingParams, pagination, loadingInitial} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);
    
    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadActivities().then(() => setLoadingNext(false));
    }

    //VERY IMPORTANT to pass a DependencyList to useEffect
    //lest the component will re-render itself endlessly fetching data
    useEffect(() => {
        if (activities.size <= 1) loadActivities();
    }, [activities.size, loadActivities] );

    return(
        <Grid>
            <Grid.Column width='10'>
                {loadingInitial && !loadingNext ? (
                    <>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>
                 ) : (
                    <InfiniteScroll 
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        //loader={<Loading content='Loading more...'/>}
                        initialLoad={true}
                    >
                    <ActivityList />
                    </InfiniteScroll>
                 )}
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
});