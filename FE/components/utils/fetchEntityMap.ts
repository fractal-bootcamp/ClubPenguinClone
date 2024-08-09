// fetches entity map for a debug overlay

export const fetchEntityMap = async () => {

    const response = await fetch('/get-entity-map');
    const data = await response.json();
    console.log(data);
    return data;

};