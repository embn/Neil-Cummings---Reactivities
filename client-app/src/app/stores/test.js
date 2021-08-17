

groupedActivities() {

    return Object.entries(
        this.activitiesByDate.reduce((activities, activity) => {
            const date = activity.date
            /*we use object property accessor to get the Activity[] which has the particular date 
            if the Activity[] is truthy then we 
            */
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        })/* initial value used to build return value of reduce */
    );
};