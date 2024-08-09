
export const sendMapToServer = async (entityMap: any) => {

    const url = 'http://localhost:9000/create-entity-map'; // Endpoint URL

    const data = new FormData();

    const jsonString = JSON.stringify(entityMap);
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    data.append('file', blob);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: data, // Removed headers as FormData sets the correct Content-Type automatically
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);
    } catch (error) {
        console.error('Error:', error);
    }



}
