export interface ChatComment {
    id: number;
    createdAt: Date;
    body: string;
    authorName: string;
    authorDisplayName: string;
    image: string;
}
export interface ChatCommentFormVaues {
    activityId: string;
    body: string;
}