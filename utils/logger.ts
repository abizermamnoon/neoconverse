export const logToFile = async (data: any) => {
    try {
        const response = await fetch('/api/logger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error('Failed to write log');
        }
    } catch (error) {
        console.error('Error writing log:', error);
    }
};