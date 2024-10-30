export function humanizeDate(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = targetDate - now;

    const isPast = diffInMs < 0;
    const diffInSeconds = Math.abs(Math.floor(diffInMs / 1000));
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    const timePhrase = isPast ? 'ago' : 'In';

    if (diffInYears > 1) return `${isPast ? diffInYears + ' years ago' : 'In ' + diffInYears + ' years'}`;
    if (diffInYears === 1) return `1 year ${timePhrase}`;
    if (diffInMonths > 1) return `${isPast ? diffInMonths + ' months ago' : 'In ' + diffInMonths + ' months'}`;
    if (diffInMonths === 1) return `1 month ${timePhrase}`;
    if (diffInDays > 1) return `${isPast ? diffInDays + ' days ago' : 'In ' + diffInDays + ' days'}`;
    if (diffInDays === 1) return `1 day ${timePhrase}`;
    if (diffInHours > 1) return `${isPast ? diffInHours + ' hours ago' : 'In ' + diffInHours + ' hours'}`;
    if (diffInHours === 1) return `1 hour ${timePhrase}`;
    if (diffInMinutes > 1) return `${isPast ? diffInMinutes + ' minutes ago' : 'In ' + diffInMinutes + ' minutes'}`;
    if (diffInMinutes === 1) return `1 minute ${timePhrase}`;

    return isPast ? `A few seconds ago` : `In a few seconds`;
}

export function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
    return new Date(date).toLocaleDateString('en-US', options);
}