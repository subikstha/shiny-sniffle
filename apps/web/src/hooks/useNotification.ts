import { useEffect, useState } from 'react';

function useNotification() {
    const [permission, setPermission] = useState<NotificationPermission | null>(null);

    useEffect(() => {
        if (!('Notification' in window)) {
            console.log('Notification API not supported');
            return;
        }

        console.log('Notification is in window');

        if (Notification.permission === 'granted') {
            console.log('Notification is already granted');
            setPermission('granted');
            return;
        }

        Notification.requestPermission().then((status) => {
            setPermission(status);
            if (status === 'granted') {
                alert('Notification granted by the user');
            }
        });
    }, []);

    return permission;
}

export default useNotification;