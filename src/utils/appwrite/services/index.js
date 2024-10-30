import { ID, account } from "@/utils/appwrite";
import { databases } from "..";
import { Query } from "appwrite";
// Auth
export async function getCurrentUser() {
    try {
        const user = await account.get();

        return user;
    } catch (error) {
        console.log(error);

        return Promise.resolve(null);
    }
}

export async function register(data = {}) {
    const { name, email, password } = data;

    return account.create(ID.unique(), email, password, name);
}

// Users
export async function createUser(data = {}) {
    const { name, email, accountId } = data;

    return databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_USERS,
        ID.unique(),
        {
            name,
            email,
            account_id: accountId
        }
    );
}

export async function getUser(accountId) {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_USERS,
            [
                Query.equal('account_id', accountId)
            ]
        );
        
        if (response.documents.length > 0) {
            return response.documents[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Trips
export async function createTrip(data = {}) {
    const { name, startDate, endDate, image } = data;

    return databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPS_ID,
        ID.unique(),
        {
            name,
            start_date: startDate,
            end_date: endDate,
            image,
        }
    );
}

export async function getAllTrips() {
    try {
        return await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPS_ID,
        );
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getTrip(tripId) {
    try {
        return await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPS_ID,
            tripId
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateTrip(tripId, data = {}) {
    const { name, startDate, endDate, image } = data;

    return databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPS_ID,
        tripId,
        {
            name,
            start_date: startDate,
            end_date: endDate,
            image
        }
    );
}

export async function deleteTrip(tripId) {
    try {
        await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPS_ID,
            tripId
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getAllUsersOfTrip(tripId) {
    try {
        const response = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPUSERS_ID,
            [
                Query.equal('trip_id', tripId)
            ]
        );
        return response.documents;
    } catch (error) {
        console.error('Error getting trip users:', error);
        return [];
    }
}

// Trip user
export async function createTripUser(tripId, userId) {
    try {
        return await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPUSERS_ID,
            ID.unique(),
            {
                trip_id: tripId,
                user_id: userId
            }
        );
    } catch (error) {
        console.error("Error adding trip user:", error);
        return null;
    }
}

export async function getAllTripsOfUser(userId) {
    try {
        return await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIPUSERS_ID,
            [
                Query.equal('user_id', userId)
            ]
        );
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Itinerary
export async function createItinerary(data = {}) {
    const { tripId, date } = data;

    return databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ID,
        ID.unique(),
        {
            trip: tripId,
            date
        }
    );
}

export async function getItinerary(itineraryId) {
    try {
        return await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ID,
            itineraryId
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateItinerary(itineraryId, data = {}) {
    const { date } = data;

    return databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ID,
        itineraryId,
        {
            date
        }
    );
}

export async function deleteItinerary(itineraryId) {
    try {
        await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ID,
            itineraryId
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getAllItineraryAndActivities(tripId) {
    try {
        const itineraries = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ID,
            [
                Query.equal('trip', tripId)
            ]
        );

        const itinerariesWithActivities = await Promise.all(
            itineraries.documents.map(async (itinerary) => {
                const activities = await databases.listDocuments(
                    import.meta.env.VITE_APPWRITE_DATABASE_ID,
                    import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ACTIVITIES_ID,
                    [
                        Query.equal('itinerary', itinerary.$id)
                    ]
                );

                return {
                    ...itinerary,
                    activities: activities.documents
                };
            })
        );

        return itinerariesWithActivities;
    } catch (error) {
        console.error('Error getting itineraries and activities:', error);
        return [];
    }
}

// Itinerary Activities
export async function createItineraryActivity(data = {}) {
    const { itineraryId, name, description } = data;

    return databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ACTIVITIES_ID,
        ID.unique(),
        {
            itinerary: itineraryId,
            name,
            description,
        }
    );
}

export async function getItineraryActivity(activityId) {
    try {
        return await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ACTIVITIES_ID,
            activityId
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateItineraryActivity(activityId, data = {}) {
    const { name, description } = data;

    return databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ACTIVITIES_ID,
        activityId,
        {
            name,
            description
        }
    );
}

export async function deleteItineraryActivity(activityId) {
    try {
        await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_ITINERARY_ACTIVITIES_ID,
            activityId
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Trip Notes
export async function createTripNote(data = {}) {
    const { tripId, name, description } = data;

    return databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIP_NOTES_ID,
        ID.unique(),
        {
            trip: tripId,
            name,
            description
        }
    );
}

export async function getTripNote(noteId) {
    try {
        return await databases.getDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIP_NOTES_ID,
            noteId
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateTripNote(noteId, data = {}) {
    const { name, description } = data;

    return databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIP_NOTES_ID,
        noteId,
        {
            name,
            description
        }
    );
}

export async function deleteTripNote(noteId) {
    try {
        await databases.deleteDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIP_NOTES_ID,
            noteId
        );
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getAllTripNotesByTripId(tripId) {
    try {
        const notes = await databases.listDocuments(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_DATABASE_COLLECTION_TRIP_NOTES_ID,
            [
                Query.equal('trip', tripId)
            ]
        );
        return notes.documents;
    } catch (error) {
        console.error('Error getting notes:', error);
        return [];
    }
}
